package com.ecoverse.backend.dto;

import java.time.LocalDateTime;

public class LedgerTransactionDTO {

    private Long id;
    private String desc;
    private Integer amount;
    private String type; // "EARN" or "SPEND"
    private String source;
    private String date; // formatted date (e.g. "Today", "Yesterday", or "yyyy-MM-dd")
    private LocalDateTime recordedAt;

    public LedgerTransactionDTO() {
    }

    public LedgerTransactionDTO(Long id, String desc, Integer amount, String type, String source, String date, LocalDateTime recordedAt) {
        this.id = id;
        this.desc = desc;
        this.amount = amount;
        this.type = type;
        this.source = source;
        this.date = date;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
