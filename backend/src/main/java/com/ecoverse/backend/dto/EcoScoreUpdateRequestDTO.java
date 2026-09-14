package com.ecoverse.backend.dto;

public class EcoScoreUpdateRequestDTO {
    private Integer impact;

    public EcoScoreUpdateRequestDTO() {}

    public EcoScoreUpdateRequestDTO(Integer impact) {
        this.impact = impact;
    }

    public Integer getImpact() {
        return impact;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
    }
}
