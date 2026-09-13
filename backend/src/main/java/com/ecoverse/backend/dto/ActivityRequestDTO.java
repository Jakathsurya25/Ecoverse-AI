package com.ecoverse.backend.dto;

public class ActivityRequestDTO {

    private String transportMode;
    private Double transportDistanceKm;
    private Double electricityKwh;
    private Double waterLitres;
    private Double plasticKg;
    private Double wasteKg;

    public ActivityRequestDTO() {
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
}
