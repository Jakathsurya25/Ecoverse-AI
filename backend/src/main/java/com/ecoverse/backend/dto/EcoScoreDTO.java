package com.ecoverse.backend.dto;

public class EcoScoreDTO {
    private Integer ecoScore;

    public EcoScoreDTO() {}

    public EcoScoreDTO(Integer ecoScore) {
        this.ecoScore = ecoScore;
    }

    public Integer getEcoScore() {
        return ecoScore;
    }

    public void setEcoScore(Integer ecoScore) {
        this.ecoScore = ecoScore;
    }
}
