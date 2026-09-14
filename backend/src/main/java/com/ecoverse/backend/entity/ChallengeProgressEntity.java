package com.ecoverse.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_progress")
public class ChallengeProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long challengeId;
    private Double progressValue;
    private Boolean completed;
    private LocalDateTime completedAt;

    public ChallengeProgressEntity() {
    }

    public ChallengeProgressEntity(Long challengeId, Double progressValue, Boolean completed, LocalDateTime completedAt) {
        this.challengeId = challengeId;
        this.progressValue = progressValue;
        this.completed = completed;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(Long challengeId) {
        this.challengeId = challengeId;
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
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
