package com.ecoverse.backend.dto;

public class FutureImpactDTO {

    private Double currentPeriodCo2Kg;
    private Double projectedMonthlyCo2Kg;
    private Double projectedYearlyCo2Kg;
    private Double potentialReductionPercent;
    private Double projectedSavingsKg;
    private String message;

    public FutureImpactDTO() {
    }

    public FutureImpactDTO(Double currentPeriodCo2Kg, Double projectedMonthlyCo2Kg, Double projectedYearlyCo2Kg, Double potentialReductionPercent, Double projectedSavingsKg, String message) {
        this.currentPeriodCo2Kg = currentPeriodCo2Kg;
        this.projectedMonthlyCo2Kg = projectedMonthlyCo2Kg;
        this.projectedYearlyCo2Kg = projectedYearlyCo2Kg;
        this.potentialReductionPercent = potentialReductionPercent;
        this.projectedSavingsKg = projectedSavingsKg;
        this.message = message;
    }

    public Double getCurrentPeriodCo2Kg() {
        return currentPeriodCo2Kg;
    }

    public void setCurrentPeriodCo2Kg(Double currentPeriodCo2Kg) {
        this.currentPeriodCo2Kg = currentPeriodCo2Kg;
    }

    public Double getProjectedMonthlyCo2Kg() {
        return projectedMonthlyCo2Kg;
    }

    public void setProjectedMonthlyCo2Kg(Double projectedMonthlyCo2Kg) {
        this.projectedMonthlyCo2Kg = projectedMonthlyCo2Kg;
    }

    public Double getProjectedYearlyCo2Kg() {
        return projectedYearlyCo2Kg;
    }

    public void setProjectedYearlyCo2Kg(Double projectedYearlyCo2Kg) {
        this.projectedYearlyCo2Kg = projectedYearlyCo2Kg;
    }

    public Double getPotentialReductionPercent() {
        return potentialReductionPercent;
    }

    public void setPotentialReductionPercent(Double potentialReductionPercent) {
        this.potentialReductionPercent = potentialReductionPercent;
    }

    public Double getProjectedSavingsKg() {
        return projectedSavingsKg;
    }

    public void setProjectedSavingsKg(Double projectedSavingsKg) {
        this.projectedSavingsKg = projectedSavingsKg;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
