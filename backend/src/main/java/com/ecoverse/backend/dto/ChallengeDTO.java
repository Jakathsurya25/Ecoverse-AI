package com.ecoverse.backend.dto;

import java.time.LocalDateTime;

public class ChallengeDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private Double targetValue;
    private String unit;
    private Integer ecoCoinsReward;
    private Integer coins;
    private Integer pts;
    private String difficulty;
    private Double progressValue;
    private Boolean completed;
    private Boolean done;
    private LocalDateTime completedAt;
    private String message;

    public ChallengeDTO() {
    }

    public ChallengeDTO(Long id, String title, String description, String category, Double targetValue,
                        String unit, Integer ecoCoinsReward, Integer pts, String difficulty,
                        Double progressValue, Boolean completed, LocalDateTime completedAt, String message) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.targetValue = targetValue;
        this.unit = unit;
        this.ecoCoinsReward = ecoCoinsReward;
        this.coins = ecoCoinsReward;
        this.pts = pts != null ? pts : 50;
        this.difficulty = difficulty;
        this.progressValue = progressValue;
        this.completed = completed;
        this.done = completed;
        this.completedAt = completedAt;
        this.message = message;
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
        this.coins = ecoCoinsReward;
    }

    public Integer getCoins() {
        return coins != null ? coins : ecoCoinsReward;
    }

    public void setCoins(Integer coins) {
        this.coins = coins;
    }

    public Integer getPts() {
        return pts;
    }

    public void setPts(Integer pts) {
        this.pts = pts;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Double getProgressValue() {
        return progressValue;
    }

    public void setProgressValue(Double progressValue) {
        this.progressValue = progressValue;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
        this.done = completed;
    }

    public Boolean getDone() {
        return done != null ? done : completed;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
