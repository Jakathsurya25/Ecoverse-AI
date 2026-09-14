package com.ecoverse.backend.dto;

public class RedeemResponseDTO {

    private Boolean success;
    private String message;
    private Integer newBalance;
    private String redeemedItem;

    public RedeemResponseDTO() {
    }

    public RedeemResponseDTO(Boolean success, String message, Integer newBalance, String redeemedItem) {
        this.success = success;
        this.message = message;
        this.newBalance = newBalance;
        this.redeemedItem = redeemedItem;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getNewBalance() {
        return newBalance;
    }

    public void setNewBalance(Integer newBalance) {
        this.newBalance = newBalance;
    }

    public String getRedeemedItem() {
        return redeemedItem;
    }

    public void setRedeemedItem(String redeemedItem) {
        this.redeemedItem = redeemedItem;
    }
}
