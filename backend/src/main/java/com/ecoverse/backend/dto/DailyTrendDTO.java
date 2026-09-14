package com.ecoverse.backend.dto;

public class DailyTrendDTO {

    private String name;
    private String date;
    private Double carbon;
    private Double water;
    private Double electricity;

    public DailyTrendDTO() {
    }

    public DailyTrendDTO(String name, String date, Double carbon, Double water, Double electricity) {
        this.name = name;
        this.date = date;
        this.carbon = carbon;
        this.water = water;
        this.electricity = electricity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Double getCarbon() {
        return carbon;
    }

    public void setCarbon(Double carbon) {
        this.carbon = carbon;
    }

    public Double getWater() {
        return water;
    }

    public void setWater(Double water) {
        this.water = water;
    }

    public Double getElectricity() {
        return electricity;
    }

    public void setElectricity(Double electricity) {
        this.electricity = electricity;
    }
}
