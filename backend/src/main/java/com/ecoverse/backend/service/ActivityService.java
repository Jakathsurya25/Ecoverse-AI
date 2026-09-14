package com.ecoverse.backend.service;

import com.ecoverse.backend.dto.ActivityRequestDTO;
import com.ecoverse.backend.dto.ActivityResponseDTO;
import com.ecoverse.backend.entity.ActivityEntity;
import com.ecoverse.backend.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final EcoScoreService ecoScoreService;
    private final WalletService walletService;
    private final ChallengeService challengeService;

    @Autowired
    public ActivityService(ActivityRepository activityRepository, EcoScoreService ecoScoreService, WalletService walletService, ChallengeService challengeService) {
        this.activityRepository = activityRepository;
        this.ecoScoreService = ecoScoreService;
        this.walletService = walletService;
        this.challengeService = challengeService;
    }

    public ActivityResponseDTO recordActivity(ActivityRequestDTO request) {
        // Default nulls to 0.0
        double distKm = request.getTransportDistanceKm() != null ? request.getTransportDistanceKm() : 0.0;
        double kwh = request.getElectricityKwh() != null ? request.getElectricityKwh() : 0.0;
        double waterL = request.getWaterLitres() != null ? request.getWaterLitres() : 0.0;
        double plasticKg = request.getPlasticKg() != null ? request.getPlasticKg() : 0.0;
        double wasteKg = request.getWasteKg() != null ? request.getWasteKg() : 0.0;
        String mode = request.getTransportMode() != null ? request.getTransportMode().trim().toUpperCase() : "CAR_GASOLINE";

        // Emission factors (kg CO2 / km)
        double modeFactor;
        if (mode.contains("BICYCLE") || mode.contains("WALK") || mode.equals("BIKE")) {
            modeFactor = 0.0;
        } else if (mode.contains("TRAIN")) {
            modeFactor = 0.035;
        } else if (mode.contains("EV") || mode.contains("ELECTRIC")) {
            modeFactor = 0.053;
        } else if (mode.contains("BUS") || mode.contains("PUBLIC")) {
            modeFactor = 0.089;
        } else {
            modeFactor = 0.192; // Baseline gasoline car
        }

        double baselineFactor = 0.192; // Gasoline car baseline

        double transportEmissions = distKm * modeFactor;
        double co2SavedTransport = Math.max(0.0, (baselineFactor - modeFactor) * distKm);
        double electricityEmissions = kwh * 0.45; // grid average kg CO2/kWh
        double waterEmissions = waterL * 0.0003; // water footprint kg CO2/L
        double plasticEmissions = plasticKg * 2.5; // plastic footprint kg CO2/kg
        double wasteEmissions = wasteKg * 1.5; // waste footprint kg CO2/kg

        double totalEstimatedEmissions = transportEmissions + electricityEmissions + waterEmissions + plasticEmissions + wasteEmissions;

        int ecoScoreImpact = (int) Math.round((co2SavedTransport * 12.0) + Math.max(0.0, (15.0 - totalEstimatedEmissions) * 1.5));
        if (ecoScoreImpact < 1) ecoScoreImpact = 5; // Base points for logging

        ActivityEntity entity = new ActivityEntity();
        entity.setTransportMode(request.getTransportMode());
        entity.setTransportDistanceKm(distKm);
        entity.setElectricityKwh(kwh);
        entity.setWaterLitres(waterL);
        entity.setPlasticKg(plasticKg);
        entity.setWasteKg(wasteKg);
        entity.setEstimatedCo2EmissionsKg(Math.round(totalEstimatedEmissions * 100.0) / 100.0);
        entity.setCo2SavedTransport(Math.round(co2SavedTransport * 100.0) / 100.0);
        entity.setEcoScoreImpact(ecoScoreImpact);
        entity.setRecordedAt(LocalDateTime.now());

        ActivityEntity savedEntity = activityRepository.save(entity);

        // Apply Eco Score impact to persistent score state
        ecoScoreService.applyImpact(ecoScoreImpact);

        // Credit EcoCoins to wallet (ActivityService is single source of truth for activity rewards)
        walletService.addEarnedCoins(ecoScoreImpact, "Logged Sustainable Activity (" + mode + ")", "ACTIVITY", null);

        // Recalculate and evaluate all challenge progress automatically
        try {
            challengeService.evaluateAllChallenges();
        } catch (Exception e) {
            // Log error silently without failing activity logging
        }

        return mapToDTO(savedEntity, "Activity recorded and environmental impact successfully calculated!");
    }

    public List<ActivityResponseDTO> getAllActivities() {
        return activityRepository.findAll().stream()
                .map(entity -> mapToDTO(entity, null))
                .collect(Collectors.toList());
    }

    public List<ActivityResponseDTO> getTodayActivities() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        return activityRepository.findByRecordedAtBetween(startOfDay, endOfDay).stream()
                .map(entity -> mapToDTO(entity, null))
                .collect(Collectors.toList());
    }

    public com.ecoverse.backend.dto.AnalyticsSummaryDTO getAnalyticsSummary() {
        List<ActivityEntity> activities = activityRepository.findAll();
        if (activities.isEmpty()) {
            return new com.ecoverse.backend.dto.AnalyticsSummaryDTO(
                    0L, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0L, java.util.Collections.emptyList()
            );
        }

        long totalActivities = activities.size();
        double totalCo2Emissions = 0.0;
        double totalCo2Saved = 0.0;
        double totalDistKm = 0.0;
        double totalKwh = 0.0;
        double totalWater = 0.0;
        double totalPlastic = 0.0;
        double totalWaste = 0.0;

        java.util.Map<LocalDate, List<ActivityEntity>> groupedByDate = new java.util.TreeMap<>();

        for (ActivityEntity a : activities) {
            if (a.getEstimatedCo2EmissionsKg() != null) totalCo2Emissions += a.getEstimatedCo2EmissionsKg();
            if (a.getCo2SavedTransport() != null) totalCo2Saved += a.getCo2SavedTransport();
            if (a.getTransportDistanceKm() != null) totalDistKm += a.getTransportDistanceKm();
            if (a.getElectricityKwh() != null) totalKwh += a.getElectricityKwh();
            if (a.getWaterLitres() != null) totalWater += a.getWaterLitres();
            if (a.getPlasticKg() != null) totalPlastic += a.getPlasticKg();
            if (a.getWasteKg() != null) totalWaste += a.getWasteKg();

            if (a.getRecordedAt() != null) {
                LocalDate date = a.getRecordedAt().toLocalDate();
                groupedByDate.computeIfAbsent(date, k -> new java.util.ArrayList<>()).add(a);
            }
        }

        long activeDays = groupedByDate.keySet().size();

        java.time.format.DateTimeFormatter dateFormatter = java.time.format.DateTimeFormatter.ISO_LOCAL_DATE;
        List<com.ecoverse.backend.dto.DailyTrendDTO> dailyTrends = new java.util.ArrayList<>();

        for (java.util.Map.Entry<LocalDate, List<ActivityEntity>> entry : groupedByDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<ActivityEntity> dayActivities = entry.getValue();

            String name = date.getDayOfWeek().getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH);
            double dayCarbon = dayActivities.stream().mapToDouble(a -> a.getEstimatedCo2EmissionsKg() != null ? a.getEstimatedCo2EmissionsKg() : 0.0).sum();
            double dayWater = dayActivities.stream().mapToDouble(a -> a.getWaterLitres() != null ? a.getWaterLitres() : 0.0).sum();
            double dayElectricity = dayActivities.stream().mapToDouble(a -> a.getElectricityKwh() != null ? a.getElectricityKwh() : 0.0).sum();

            dailyTrends.add(new com.ecoverse.backend.dto.DailyTrendDTO(
                    name,
                    date.format(dateFormatter),
                    Math.round(dayCarbon * 100.0) / 100.0,
                    Math.round(dayWater * 100.0) / 100.0,
                    Math.round(dayElectricity * 100.0) / 100.0
            ));
        }

        return new com.ecoverse.backend.dto.AnalyticsSummaryDTO(
                totalActivities,
                Math.round(totalCo2Emissions * 100.0) / 100.0,
                Math.round(totalCo2Saved * 100.0) / 100.0,
                Math.round(totalDistKm * 100.0) / 100.0,
                Math.round(totalKwh * 100.0) / 100.0,
                Math.round(totalWater * 100.0) / 100.0,
                Math.round(totalPlastic * 100.0) / 100.0,
                Math.round(totalWaste * 100.0) / 100.0,
                activeDays,
                dailyTrends
        );
    }

    private ActivityResponseDTO mapToDTO(ActivityEntity entity, String message) {
        ActivityResponseDTO dto = new ActivityResponseDTO();
        dto.setId(entity.getId());
        dto.setTransportMode(entity.getTransportMode());
        dto.setTransportDistanceKm(entity.getTransportDistanceKm());
        dto.setElectricityKwh(entity.getElectricityKwh());
        dto.setWaterLitres(entity.getWaterLitres());
        dto.setPlasticKg(entity.getPlasticKg());
        dto.setWasteKg(entity.getWasteKg());
        dto.setEstimatedCo2EmissionsKg(entity.getEstimatedCo2EmissionsKg());
        dto.setCo2SavedTransport(entity.getCo2SavedTransport());
        dto.setEcoScoreImpact(entity.getEcoScoreImpact());
        dto.setRecordedAt(entity.getRecordedAt());
        dto.setMessage(message);
        return dto;
    }
}
