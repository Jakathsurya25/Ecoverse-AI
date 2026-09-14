package com.ecoverse.backend.dto;

public class WalletResponseDTO {

    private Long id;
    private Integer balance;
    private Integer lifetimeEarned;
    private Double equivalentOffsetsTons;
    private Integer treesPlanted;
    private String realWorldImpactText;

    public WalletResponseDTO() {
    }

    public WalletResponseDTO(Long id, Integer balance, Integer lifetimeEarned, Double equivalentOffsetsTons, Integer treesPlanted, String realWorldImpactText) {
        this.id = id;
        this.balance = balance;
        this.lifetimeEarned = lifetimeEarned;
        this.equivalentOffsetsTons = equivalentOffsetsTons;
        this.treesPlanted = treesPlanted;
        this.realWorldImpactText = realWorldImpactText;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getBalance() {
        return balance;
    }

    public void setBalance(Integer balance) {
        this.balance = balance;
    }

    public Integer getLifetimeEarned() {
        return lifetimeEarned;
    }

    public void setLifetimeEarned(Integer lifetimeEarned) {
        this.lifetimeEarned = lifetimeEarned;
    }

    public Double getEquivalentOffsetsTons() {
        return equivalentOffsetsTons;
    }

    public void setEquivalentOffsetsTons(Double equivalentOffsetsTons) {
        this.equivalentOffsetsTons = equivalentOffsetsTons;
    }

    public Integer getTreesPlanted() {
        return treesPlanted;
    }

    public void setTreesPlanted(Integer treesPlanted) {
        this.treesPlanted = treesPlanted;
    }

    public String getRealWorldImpactText() {
        return realWorldImpactText;
    }

    public void setRealWorldImpactText(String realWorldImpactText) {
        this.realWorldImpactText = realWorldImpactText;
    }
}
