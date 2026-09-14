package com.ecoverse.backend.service;

import com.ecoverse.backend.dto.RecommendationDTO;
import com.ecoverse.backend.entity.ActivityEntity;
import com.ecoverse.backend.repository.ActivityRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    private final ActivityRepository activityRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${gemini.api.key:${GEMINI_API_KEY:}}")
    private String geminiApiKey;

    @Autowired
    public RecommendationService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    public List<RecommendationDTO> getRecommendations() {
        // 1. Verify GEMINI_API_KEY presence
        String apiKey = (geminiApiKey != null && !geminiApiKey.trim().isEmpty())
                ? geminiApiKey.trim()
                : System.getenv("GEMINI_API_KEY");

        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.error("GEMINI_API_KEY environment variable is not configured.");
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable."
            );
        }

        // 2. Retrieve user activities from the database
        List<ActivityEntity> activities = activityRepository.findAll();

        // 3. Build context from real activity records
        String prompt = buildPrompt(activities);

        // 4. Call Gemini API
        String rawResponse = callGeminiApi(apiKey.trim(), prompt);

        // 5. Parse and validate the response
        return parseAndValidateRecommendations(rawResponse);
    }

    private String buildPrompt(List<ActivityEntity> activities) {
        StringBuilder dataSummary = new StringBuilder();
        if (activities.isEmpty()) {
            dataSummary.append("No activities recorded yet. User is just getting started with EcoVerse Tracker.\n");
        } else {
            dataSummary.append("Logged Activity Records (most recent first):\n");
            // Take the latest 10 activities for context
            int count = 0;
            for (int i = activities.size() - 1; i >= 0 && count < 10; i--, count++) {
                ActivityEntity a = activities.get(i);
                dataSummary.append(String.format(
                        "- Mode: %s, Distance: %.2f km, Electricity: %.2f kWh, Water: %.1f L, Plastic: %.2f kg, Waste: %.2f kg, Est CO2: %.2f kg, CO2 Saved: %.2f kg, Timestamp: %s\n",
                        a.getTransportMode() != null ? a.getTransportMode() : "Unknown",
                        a.getTransportDistanceKm() != null ? a.getTransportDistanceKm() : 0.0,
                        a.getElectricityKwh() != null ? a.getElectricityKwh() : 0.0,
                        a.getWaterLitres() != null ? a.getWaterLitres() : 0.0,
                        a.getPlasticKg() != null ? a.getPlasticKg() : 0.0,
                        a.getWasteKg() != null ? a.getWasteKg() : 0.0,
                        a.getEstimatedCo2EmissionsKg() != null ? a.getEstimatedCo2EmissionsKg() : 0.0,
                        a.getCo2SavedTransport() != null ? a.getCo2SavedTransport() : 0.0,
                        a.getRecordedAt() != null ? a.getRecordedAt().toString() : "Recent"
                ));
            }
        }

        return "You are an expert AI sustainability coach for the EcoVerse AI platform.\n"
                + "Analyze the following user environmental activity data and generate tailored, actionable sustainability recommendations:\n\n"
                + dataSummary.toString() + "\n"
                + "STRICT REQUIREMENTS:\n"
                + "1. Return ONLY a valid JSON array matching this exact schema:\n"
                + "[\n"
                + "  {\n"
                + "    \"category\": \"string (e.g. TRANSPORT, ENERGY, WATER, WASTE, or FOOD)\",\n"
                + "    \"title\": \"string (short, engaging actionable directive)\",\n"
                + "    \"description\": \"string (clear explanation referencing the user's specific activity data and how to optimize it)\",\n"
                + "    \"potentialSavingsCo2\": number (estimated reduction in kg CO2),\n"
                + "    \"difficulty\": \"Easy | Medium | Hard\"\n"
                + "  }\n"
                + "]\n"
                + "2. Return a maximum of 3 recommendations.\n"
                + "3. Do not include markdown codeblocks (no ``` or ```json). Return pure JSON.\n"
                + "4. Do not invent fake activity numbers; ground your analysis strictly in the provided data.\n"
                + "5. potentialSavingsCo2 must be a positive number.\n"
                + "6. difficulty must be strictly one of: 'Easy', 'Medium', or 'Hard'.\n";
    }

    private String callGeminiApi(String apiKey, String prompt) {
        List<String> models = Arrays.asList(
                "gemini-3.5-flash-lite",
                "gemini-flash-lite-latest",
                "gemini-3.8-flash",
                "gemini-3.7-flash",
                "gemini-3.6-flash",
                "gemini-3.5-flash"
        );

        int lastStatusCode = 0;

        for (String modelName : models) {
            try {
                logger.info("Attempting Gemini AI call using model: {}", modelName);
                String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/"
                        + modelName + ":generateContent?key="
                        + URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

                Map<String, Object> textPart = Collections.singletonMap("text", prompt);
                Map<String, Object> partsWrapper = Collections.singletonMap("parts", Collections.singletonList(textPart));
                Map<String, Object> contentMap = new HashMap<>();
                contentMap.put("contents", Collections.singletonList(partsWrapper));

                Map<String, Object> genConfig = new HashMap<>();
                genConfig.put("temperature", 0.2);
                genConfig.put("responseMimeType", "application/json");
                contentMap.put("generationConfig", genConfig);

                String requestBody = objectMapper.writeValueAsString(contentMap);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .timeout(Duration.ofSeconds(12))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    logger.info("Gemini model {} succeeded with HTTP 200", modelName);
                    JsonNode root = objectMapper.readTree(response.body());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && !candidates.isEmpty()) {
                        JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                        if (!textNode.isMissingNode() && !textNode.asText().trim().isEmpty()) {
                            return textNode.asText().trim();
                        }
                    }
                }

                lastStatusCode = response.statusCode();
                logger.warn("Gemini model {} returned HTTP status {}", modelName, response.statusCode());

                if (response.statusCode() == 400 || response.statusCode() == 403) {
                    logger.error("Gemini API authentication failed with HTTP status {}", response.statusCode());
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Gemini API authentication failed. Verify your GEMINI_API_KEY.");
                }
            } catch (ResponseStatusException rse) {
                throw rse;
            } catch (Exception e) {
                logger.warn("Exception calling Gemini model {}: {}", modelName, e.getMessage());
            }
        }

        logger.error("All fallback Gemini models failed. Last status code: {}", lastStatusCode);
        throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini AI service returned status " + (lastStatusCode != 0 ? lastStatusCode : 502));
    }

    private List<RecommendationDTO> parseAndValidateRecommendations(String rawText) {
        try {
            String cleaned = rawText.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            List<RecommendationDTO> list = objectMapper.readValue(cleaned, new TypeReference<List<RecommendationDTO>>() {});

            if (list == null || list.isEmpty()) {
                return Collections.emptyList();
            }

            // Cap at 3 recommendations
            if (list.size() > 3) {
                list = list.subList(0, 3);
            }

            // Validate fields
            for (RecommendationDTO rec : list) {
                if (rec.getCategory() == null || rec.getCategory().trim().isEmpty()) {
                    rec.setCategory("GENERAL");
                } else {
                    rec.setCategory(rec.getCategory().trim().toUpperCase());
                }

                if (rec.getTitle() == null) {
                    rec.setTitle("Eco Action Directive");
                }

                if (rec.getDescription() == null) {
                    rec.setDescription("Optimize daily habits to lower carbon intensity.");
                }

                if (rec.getPotentialSavingsCo2() == null || rec.getPotentialSavingsCo2() < 0) {
                    rec.setPotentialSavingsCo2(0.5);
                }

                String diff = rec.getDifficulty();
                if (diff == null || (!diff.equalsIgnoreCase("Easy") && !diff.equalsIgnoreCase("Medium") && !diff.equalsIgnoreCase("Hard"))) {
                    rec.setDifficulty("Medium");
                } else {
                    // Normalize casing
                    if (diff.equalsIgnoreCase("Easy")) rec.setDifficulty("Easy");
                    else if (diff.equalsIgnoreCase("Hard")) rec.setDifficulty("Hard");
                    else rec.setDifficulty("Medium");
                }
            }

            return list;
        } catch (Exception e) {
            logger.error("Failed to parse Gemini JSON recommendations: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to parse structured recommendations from AI response.");
        }
    }
}
