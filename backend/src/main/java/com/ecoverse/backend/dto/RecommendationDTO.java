package com.ecoverse.backend.dto;

public class RecommendationDTO {

    private String category;
    private String title;
    private String description;
    private Double potentialSavingsCo2;
    private String difficulty; // Easy | Medium | Hard

    public RecommendationDTO() {
    }

    public RecommendationDTO(String category, String title, String description, Double potentialSavingsCo2, String difficulty) {
        this.category = category;
        this.title = title;
        this.description = description;
        this.potentialSavingsCo2 = potentialSavingsCo2;
        this.difficulty = difficulty;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPotentialSavingsCo2() {
        return potentialSavingsCo2;
    }

    public void setPotentialSavingsCo2(Double potentialSavingsCo2) {
        this.potentialSavingsCo2 = potentialSavingsCo2;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}
