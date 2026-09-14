package com.ecoverse.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "eco_score")
public class EcoScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer currentScore;

    public EcoScoreEntity() {}

    public EcoScoreEntity(Integer currentScore) {
        this.currentScore = currentScore;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCurrentScore() {
        return currentScore;
    }

    public void setCurrentScore(Integer currentScore) {
        this.currentScore = currentScore;
    }
}
