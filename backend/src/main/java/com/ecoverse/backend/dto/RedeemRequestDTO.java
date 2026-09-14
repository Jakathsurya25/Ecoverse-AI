package com.ecoverse.backend.dto;

public class RedeemRequestDTO {

    private Long rewardId;
    private String rewardTitle;

    public RedeemRequestDTO() {
    }

    public RedeemRequestDTO(Long rewardId, String rewardTitle) {
        this.rewardId = rewardId;
        this.rewardTitle = rewardTitle;
    }

    public Long getRewardId() {
        return rewardId;
    }

    public void setRewardId(Long rewardId) {
        this.rewardId = rewardId;
    }

    public String getRewardTitle() {
        return rewardTitle;
    }

    public void setRewardTitle(String rewardTitle) {
        this.rewardTitle = rewardTitle;
    }
}
