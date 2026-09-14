package com.ecoverse.backend.dto;

import java.util.List;

public class AnalyticsSummaryDTO {

    private Long totalActivities;
    private Double totalCo2EmissionsKg;
    private Double totalCo2SavedTransportKg;
    private Double totalTransportDistanceKm;
    private Double totalElectricityKwh;
    private Double totalWaterLitres;
    private Double totalPlasticKg;
    private Double totalWasteKg;
    private Long activeDays;
    private List<DailyTrendDTO> dailyTrends;

    public AnalyticsSummaryDTO() {
    }

    public AnalyticsSummaryDTO(Long totalActivities, Double totalCo2EmissionsKg, Double totalCo2SavedTransportKg,
                               Double totalTransportDistanceKm, Double totalElectricityKwh, Double totalWaterLitres,
                               Double totalPlasticKg, Double totalWasteKg, Long activeDays, List<DailyTrendDTO> dailyTrends) {
        this.totalActivities = totalActivities;
        this.totalCo2EmissionsKg = totalCo2EmissionsKg;
        this.totalCo2SavedTransportKg = totalCo2SavedTransportKg;
        this.totalTransportDistanceKm = totalTransportDistanceKm;
        this.totalElectricityKwh = totalElectricityKwh;
        this.totalWaterLitres = totalWaterLitres;
        this.totalPlasticKg = totalPlasticKg;
        this.totalWasteKg = totalWasteKg;
        this.activeDays = activeDays;
        this.dailyTrends = dailyTrends;
    }

    public Long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(Long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public Double getTotalCo2EmissionsKg() {
        return totalCo2EmissionsKg;
    }

    public void setTotalCo2EmissionsKg(Double totalCo2EmissionsKg) {
        this.totalCo2EmissionsKg = totalCo2EmissionsKg;
    }

    public Double getTotalCo2SavedTransportKg() {
        return totalCo2SavedTransportKg;
    }

    public void setTotalCo2SavedTransportKg(Double totalCo2SavedTransportKg) {
        this.totalCo2SavedTransportKg = totalCo2SavedTransportKg;
    }

    public Double getTotalTransportDistanceKm() {
        return totalTransportDistanceKm;
    }

    public void setTotalTransportDistanceKm(Double totalTransportDistanceKm) {
        this.totalTransportDistanceKm = totalTransportDistanceKm;
    }

    public Double getTotalElectricityKwh() {
        return totalElectricityKwh;
    }

    public void setTotalElectricityKwh(Double totalElectricityKwh) {
        this.totalElectricityKwh = totalElectricityKwh;
    }

    public Double getTotalWaterLitres() {
        return totalWaterLitres;
    }

    public void setTotalWaterLitres(Double totalWaterLitres) {
        this.totalWaterLitres = totalWaterLitres;
    }

    public Double getTotalPlasticKg() {
        return totalPlasticKg;
    }

    public void setTotalPlasticKg(Double totalPlasticKg) {
        this.totalPlasticKg = totalPlasticKg;
    }

    public Double getTotalWasteKg() {
        return totalWasteKg;
    }

    public void setTotalWasteKg(Double totalWasteKg) {
        this.totalWasteKg = totalWasteKg;
    }

    public Long getActiveDays() {
        return activeDays;
    }

    public void setActiveDays(Long activeDays) {
        this.activeDays = activeDays;
    }

    public List<DailyTrendDTO> getDailyTrends() {
        return dailyTrends;
    }

    public void setDailyTrends(List<DailyTrendDTO> dailyTrends) {
        this.dailyTrends = dailyTrends;
    }
}
