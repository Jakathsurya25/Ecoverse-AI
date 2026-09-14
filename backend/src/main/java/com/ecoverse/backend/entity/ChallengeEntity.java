package com.ecoverse.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenges")
public class ChallengeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private Double targetValue;
    private String unit;
    private Integer ecoCoinsReward;
    private String difficulty;
    private Boolean active;
    private LocalDateTime createdAt;

    public ChallengeEntity() {
    }

    public ChallengeEntity(String title, String description, String category, Double targetValue,
                           String unit, Integer ecoCoinsReward, String difficulty, Boolean active,
                           LocalDateTime createdAt) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.targetValue = targetValue;
        this.unit = unit;
        this.ecoCoinsReward = ecoCoinsReward;
        this.difficulty = difficulty;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(Double targetValue) {
        this.targetValue = targetValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getEcoCoinsReward() {
        return ecoCoinsReward;
    }

    public void setEcoCoinsReward(Integer ecoCoinsReward) {
        this.ecoCoinsReward = ecoCoinsReward;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
