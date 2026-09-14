package com.ecoverse.backend.dto;

public class RewardDTO {

    private Long id;
    private String title;
    private String desc;
    private Integer cost;
    private String type; // "tree", "ngo", "product", "offset"
    private Boolean available;

    public RewardDTO() {
    }

    public RewardDTO(Long id, String title, String desc, Integer cost, String type, Boolean available) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.cost = cost;
        this.type = type;
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

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
