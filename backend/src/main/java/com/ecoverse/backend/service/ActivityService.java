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

    @Autowired
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
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
