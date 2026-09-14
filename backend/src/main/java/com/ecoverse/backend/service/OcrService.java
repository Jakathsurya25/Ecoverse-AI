package com.ecoverse.backend.service;

import com.ecoverse.backend.dto.OcrResponseDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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
public class OcrService {

    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final WalletService walletService;

    @Value("${gemini.api.key:${GEMINI_API_KEY:}}")
    private String geminiApiKey;

    @Autowired
    public OcrService(WalletService walletService) {
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
        this.walletService = walletService;
    }

    public OcrResponseDTO scanDocument(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required for document scanning.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is too large. Maximum supported size is 10 MB.");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";

        String mimeType;
        if (contentType.contains("jpeg") || contentType.contains("jpg") || originalFilename.endsWith(".jpg") || originalFilename.endsWith(".jpeg")) {
            mimeType = "image/jpeg";
        } else if (contentType.contains("png") || originalFilename.endsWith(".png")) {
            mimeType = "image/png";
        } else if (contentType.contains("pdf") || originalFilename.endsWith(".pdf")) {
            mimeType = "application/pdf";
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported file type. Please upload a JPG, PNG, or PDF.");
        }

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

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (Exception e) {
            logger.error("Failed to read uploaded file bytes", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read uploaded file.");
        }

        String documentHash = calculateSha256Hex(fileBytes);
        String base64Data = Base64.getEncoder().encodeToString(fileBytes);
        String prompt = buildOcrPrompt();

        String rawJsonResult = callGeminiMultimodalWithFallback(apiKey.trim(), prompt, base64Data, mimeType);
        OcrResponseDTO dto = parseOcrResult(rawJsonResult);

        if (dto.isSuccess()) {
            processOcrWalletReward(dto, documentHash);
        }

        return dto;
    }

    private void processOcrWalletReward(OcrResponseDTO dto, String documentHash) {
        if (walletService == null) return;

        String docType = dto.getDocumentType() != null ? dto.getDocumentType().toUpperCase().trim() : "OTHER";
        int rewardCoins = 0;
        if (docType.contains("ELECTRICITY") || docType.contains("WATER") || docType.contains("UTILITY")) {
            rewardCoins = 100;
        } else if (docType.contains("GROCERY") || docType.contains("PLASTIC") || docType.contains("WASTE") || docType.contains("SHOPPING")) {
            rewardCoins = 50;
        } else {
            rewardCoins = 0;
        }

        if (rewardCoins <= 0) {
            dto.setMessage(dto.getMessage() + " (No EcoCoins reward for this document type.)");
            return;
        }

        if (documentHash != null && walletService.hasDocumentHashBeenRewarded(documentHash)) {
            logger.info("OcrService document SHA-256 hash {} has already received an EcoCoin reward. Skipping reward.", documentHash);
            dto.setMessage(dto.getMessage() + " (Note: EcoCoins reward was already claimed for this document.)");
            return;
        }

        String desc = "Document OCR Bonus (" + docType.replace("_", " ") + ")";
        walletService.addEarnedCoins(rewardCoins, desc, "OCR", documentHash);
        dto.setMessage(dto.getMessage() + " (+" + rewardCoins + " EcoCoins earned!)");
    }

    private String calculateSha256Hex(byte[] data) {
        if (data == null || data.length == 0) return null;
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(data);
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            logger.warn("Failed to calculate SHA-256 hash for uploaded document", e);
            return null;
        }
    }

    private String buildOcrPrompt() {
        return "You are an expert AI Document OCR & Sustainability Analyst for EcoVerse AI.\n"
                + "Analyze the attached document/image (receipt, utility bill, invoice, or product image) with absolute accuracy.\n\n"
                + "STRICT NO HALLUCINATION RULE:\n"
                + "- Extract ONLY facts clearly visible in the uploaded document.\n"
                + "- Never invent or guess consumer names, billing amounts, kWh, units, dates, merchant names, or meter readings.\n"
                + "- If a field is missing, unreadable, or not present in the document type, return null for that field.\n"
                + "- If the document quality is too blurry or unreadable to identify, return success: false.\n\n"
                + "DOCUMENT CATEGORIZATION:\n"
                + "Determine the exact documentType:\n"
                + "- ELECTRICITY_BILL\n"
                + "- WATER_BILL\n"
                + "- GROCERY_RECEIPT\n"
                + "- SHOPPING_INVOICE\n"
                + "- PLASTIC_ITEM\n"
                + "- WASTE_DOCUMENT\n"
                + "- OTHER\n\n"
                + "EXTRACTION GUIDELINES BY TYPE:\n"
                + "1. ELECTRICITY_BILL: Extract merchantOrIssuer (provider), billingAmount, currency, kwh (units consumed), previousReading, currentReading, billingPeriod, dueDate.\n"
                + "2. WATER_BILL: Extract merchantOrIssuer, billingAmount, currency, liters (water consumption in Litres/kL), previousReading, currentReading, billingPeriod.\n"
                + "3. GROCERY_RECEIPT / SHOPPING_INVOICE: Extract merchantOrIssuer (store), billingAmount, currency, itemsParsed array containing objects with: name, category, price, carbonScore (\"LOW\"|\"MEDIUM\"|\"HIGH\").\n"
                + "4. PLASTIC_ITEM / WASTE_DOCUMENT: Extract recyclingCategory (e.g. \"PET Plastic (Code 1)\"), instructions (disposal/recycling steps).\n"
                + "5. OTHER: Extract whatever document type and visible details are present without forcing into electricity/water/grocery.\n\n"
                + "Provide 2-3 practical, actionable sustainability recommendations based strictly on the detected document items.\n\n"
                + "RESPONSE FORMAT:\n"
                + "Return valid JSON ONLY matching this structure:\n"
                + "{\n"
                + "  \"success\": true,\n"
                + "  \"documentType\": \"ELECTRICITY_BILL\",\n"
                + "  \"merchantOrIssuer\": \"Provider Name\",\n"
                + "  \"billingAmount\": 145.50,\n"
                + "  \"currency\": \"USD\",\n"
                + "  \"extractedData\": {\n"
                + "    \"consumerName\": null,\n"
                + "    \"billingPeriod\": null,\n"
                + "    \"previousReading\": null,\n"
                + "    \"currentReading\": null,\n"
                + "    \"unitsConsumed\": null\n"
                + "  },\n"
                + "  \"extractedMetrics\": {\n"
                + "    \"kwh\": 420.0,\n"
                + "    \"liters\": null,\n"
                + "    \"co2Emitted\": null,\n"
                + "    \"co2Saved\": null,\n"
                + "    \"plasticAvoided\": null\n"
                + "  },\n"
                + "  \"itemsParsed\": [\n"
                + "    {\"name\": \"Item name\", \"category\": \"FOOD\", \"price\": 4.50, \"carbonScore\": \"LOW\"}\n"
                + "  ],\n"
                + "  \"recyclingCategory\": null,\n"
                + "  \"instructions\": null,\n"
                + "  \"recommendations\": [\n"
                + "    \"Recommendation line 1\"\n"
                + "  ],\n"
                + "  \"confidence\": 0.95,\n"
                + "  \"message\": \"Document successfully analyzed via Gemini Multimodal OCR.\"\n"
                + "}";
    }

    private String callGeminiMultimodalWithFallback(String apiKey, String promptText, String base64Data, String mimeType) {
        String[] models = {
                "gemini-3.5-flash-lite",
                "gemini-flash-lite-latest",
                "gemini-3.8-flash",
                "gemini-3.7-flash",
                "gemini-3.6-flash",
                "gemini-3.5-flash"
        };

        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mime_type", mimeType);
        inlineData.put("data", base64Data);

        Map<String, Object> partText = Map.of("text", promptText);
        Map<String, Object> partMedia = Map.of("inline_data", inlineData);

        Map<String, Object> contentMap = Map.of("parts", List.of(partText, partMedia));
        Map<String, Object> genConfig = Map.of("response_mime_type", "application/json");

        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("contents", List.of(contentMap));
        requestBodyMap.put("generationConfig", genConfig);

        String jsonRequestBody;
        try {
            jsonRequestBody = objectMapper.writeValueAsString(requestBodyMap);
        } catch (Exception e) {
            logger.error("Failed to serialize Gemini request body", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal serialization error.");
        }

        for (String model : models) {
            try {
                logger.info("OcrService attempting Gemini Multimodal call using model: {}", model);
                String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                        model, URLEncoder.encode(apiKey, StandardCharsets.UTF_8));

                HttpRequest httpRequest = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(30))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonRequestBody))
                        .build();

                HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
                int status = response.statusCode();

                if (status == 200) {
                    logger.info("OcrService Gemini model {} succeeded with HTTP 200", model);
                    JsonNode root = objectMapper.readTree(response.body());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && !candidates.isEmpty()) {
                        JsonNode partsNode = candidates.get(0).path("content").path("parts");
                        if (partsNode.isArray() && !partsNode.isEmpty()) {
                            return partsNode.get(0).path("text").asText();
                        }
                    }
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini returned invalid response structure.");
                } else if (status == 503 || status == 429 || status == 404) {
                    logger.warn("OcrService Gemini model {} returned HTTP status {}", model, status);
                } else {
                    logger.error("OcrService Gemini model {} failed with HTTP status {}", model, status);
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini API returned status " + status);
                }
            } catch (ResponseStatusException rse) {
                throw rse;
            } catch (Exception e) {
                logger.warn("Exception during Gemini call with model {}: {}", model, e.getMessage());
            }
        }

        throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini service is currently unavailable.");
    }

    private OcrResponseDTO parseOcrResult(String rawResult) {
        if (rawResult == null || rawResult.trim().isEmpty()) {
            OcrResponseDTO fallback = new OcrResponseDTO();
            fallback.setSuccess(false);
            fallback.setMessage("Unable to read document contents.");
            fallback.setRecommendations(List.of("Please upload a clearer image or document."));
            return fallback;
        }

        String cleaned = rawResult.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "").trim();
        }

        try {
            Map<String, Object> map = objectMapper.readValue(cleaned, new TypeReference<Map<String, Object>>() {});
            OcrResponseDTO dto = new OcrResponseDTO();

            dto.setSuccess(Boolean.TRUE.equals(map.get("success")));
            dto.setDocumentType(map.get("documentType") != null ? map.get("documentType").toString() : "UNKNOWN");
            dto.setMerchantOrIssuer(map.get("merchantOrIssuer") != null ? map.get("merchantOrIssuer").toString() : null);

            if (map.get("billingAmount") instanceof Number) {
                dto.setBillingAmount(((Number) map.get("billingAmount")).doubleValue());
            }
            dto.setCurrency(map.get("currency") != null ? map.get("currency").toString() : null);

            if (map.get("extractedData") instanceof Map) {
                dto.setExtractedData((Map<String, Object>) map.get("extractedData"));
            }
            if (map.get("extractedMetrics") instanceof Map) {
                dto.setExtractedMetrics((Map<String, Object>) map.get("extractedMetrics"));
            }
            if (map.get("itemsParsed") instanceof List) {
                dto.setItemsParsed((List<Map<String, Object>>) map.get("itemsParsed"));
            }

            dto.setRecyclingCategory(map.get("recyclingCategory") != null ? map.get("recyclingCategory").toString() : null);
            dto.setInstructions(map.get("instructions") != null ? map.get("instructions").toString() : null);

            if (map.get("recommendations") instanceof List) {
                List<String> recs = new ArrayList<>();
                for (Object item : (List<?>) map.get("recommendations")) {
                    if (item != null) recs.add(item.toString());
                }
                dto.setRecommendations(recs);
            } else {
                dto.setRecommendations(List.of("Review usage patterns to optimize consumption."));
            }

            if (map.get("confidence") instanceof Number) {
                dto.setConfidence(((Number) map.get("confidence")).doubleValue());
            }
            dto.setMessage(map.get("message") != null ? map.get("message").toString() : "Document successfully analyzed.");

            return dto;
        } catch (Exception e) {
            logger.error("Failed to parse Gemini OCR JSON response: {}", cleaned, e);
            OcrResponseDTO fallback = new OcrResponseDTO();
            fallback.setSuccess(false);
            fallback.setMessage("Unable to parse document analysis. Please upload a clearer image.");
            fallback.setRecommendations(List.of("Please check document resolution and lighting."));
            return fallback;
        }
    }
}
