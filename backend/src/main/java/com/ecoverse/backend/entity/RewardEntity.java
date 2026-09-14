package com.ecoverse.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rewards")
public class RewardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 512)
    private String description;
    
    private Integer cost;
    private String rewardType; // "tree", "ngo", "product", "offset"
    private Boolean available;

    public RewardEntity() {
    }

    public RewardEntity(String title, String description, Integer cost, String rewardType, Boolean available) {
        this.title = title;
        this.description = description;
        this.cost = cost;
        this.rewardType = rewardType;
        this.available = available;
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

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public String getRewardType() {
        return rewardType;
    }

    public void setRewardType(String rewardType) {
        this.rewardType = rewardType;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
