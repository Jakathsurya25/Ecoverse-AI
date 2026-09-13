package com.ecoverse.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class ActivityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transportMode;
    private Double transportDistanceKm;
    private Double electricityKwh;
    private Double waterLitres;
    private Double plasticKg;
    private Double wasteKg;

    // Server-side calculated metrics
    private Double estimatedCo2EmissionsKg;
    private Double co2SavedTransport;
    private Integer ecoScoreImpact;

    private LocalDateTime recordedAt;

    public ActivityEntity() {
    }

    public ActivityEntity(String transportMode, Double transportDistanceKm, Double electricityKwh, 
                          Double waterLitres, Double plasticKg, Double wasteKg, 
                          Double estimatedCo2EmissionsKg, Double co2SavedTransport, 
                          Integer ecoScoreImpact, LocalDateTime recordedAt) {
        this.transportMode = transportMode;
        this.transportDistanceKm = transportDistanceKm;
        this.electricityKwh = electricityKwh;
        this.waterLitres = waterLitres;
        this.plasticKg = plasticKg;
        this.wasteKg = wasteKg;
        this.estimatedCo2EmissionsKg = estimatedCo2EmissionsKg;
        this.co2SavedTransport = co2SavedTransport;
        this.ecoScoreImpact = ecoScoreImpact;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransportMode() {
        return transportMode;
    }

    public void setTransportMode(String transportMode) {
        this.transportMode = transportMode;
    }

    public Double getTransportDistanceKm() {
        return transportDistanceKm;
    }

    public void setTransportDistanceKm(Double transportDistanceKm) {
        this.transportDistanceKm = transportDistanceKm;
    }

    public Double getElectricityKwh() {
        return electricityKwh;
    }

    public void setElectricityKwh(Double electricityKwh) {
        this.electricityKwh = electricityKwh;
    }

    public Double getWaterLitres() {
        return waterLitres;
    }

    public void setWaterLitres(Double waterLitres) {
        this.waterLitres = waterLitres;
    }

    public Double getPlasticKg() {
        return plasticKg;
    }

    public void setPlasticKg(Double plasticKg) {
        this.plasticKg = plasticKg;
    }

    public Double getWasteKg() {
        return wasteKg;
    }

    public void setWasteKg(Double wasteKg) {
        this.wasteKg = wasteKg;
    }

    public Double getEstimatedCo2EmissionsKg() {
        return estimatedCo2EmissionsKg;
    }

    public void setEstimatedCo2EmissionsKg(Double estimatedCo2EmissionsKg) {
        this.estimatedCo2EmissionsKg = estimatedCo2EmissionsKg;
    }

    public Double getCo2SavedTransport() {
        return co2SavedTransport;
    }

    public void setCo2SavedTransport(Double co2SavedTransport) {
        this.co2SavedTransport = co2SavedTransport;
    }

    public Integer getEcoScoreImpact() {
        return ecoScoreImpact;
    }

    public void setEcoScoreImpact(Integer ecoScoreImpact) {
        this.ecoScoreImpact = ecoScoreImpact;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
