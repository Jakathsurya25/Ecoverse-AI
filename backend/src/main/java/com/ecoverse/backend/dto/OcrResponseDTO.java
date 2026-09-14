package com.ecoverse.backend.dto;

import java.util.List;
import java.util.Map;

public class OcrResponseDTO {
    private boolean success;
    private String documentType;
    private String merchantOrIssuer;
    private Double billingAmount;
    private String currency;
    private Map<String, Object> extractedData;
    private Map<String, Object> extractedMetrics;
    private List<Map<String, Object>> itemsParsed;
    private String recyclingCategory;
    private String instructions;
    private Map<String, Object> sustainability;
    private List<String> recommendations;
    private Double confidence;
    private String message;

    public OcrResponseDTO() {}

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getMerchantOrIssuer() {
        return merchantOrIssuer;
    }

    public void setMerchantOrIssuer(String merchantOrIssuer) {
        this.merchantOrIssuer = merchantOrIssuer;
    }

    public Double getBillingAmount() {
        return billingAmount;
    }

    public void setBillingAmount(Double billingAmount) {
        this.billingAmount = billingAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Map<String, Object> getExtractedData() {
        return extractedData;
    }

    public void setExtractedData(Map<String, Object> extractedData) {
        this.extractedData = extractedData;
    }

    public Map<String, Object> getExtractedMetrics() {
        return extractedMetrics;
    }

    public void setExtractedMetrics(Map<String, Object> extractedMetrics) {
        this.extractedMetrics = extractedMetrics;
    }

    public List<Map<String, Object>> getItemsParsed() {
        return itemsParsed;
    }

    public void setItemsParsed(List<Map<String, Object>> itemsParsed) {
        this.itemsParsed = itemsParsed;
    }

    public String getRecyclingCategory() {
        return recyclingCategory;
    }

    public void setRecyclingCategory(String recyclingCategory) {
        this.recyclingCategory = recyclingCategory;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Map<String, Object> getSustainability() {
        return sustainability;
    }

    public void setSustainability(Map<String, Object> sustainability) {
        this.sustainability = sustainability;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
