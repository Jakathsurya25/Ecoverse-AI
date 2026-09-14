package com.ecoverse.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_ledger")
public class CarbonLedgerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long walletId;
    private String type; // "EARN" or "SPEND"
    private String description;
    private Integer amount; // positive for EARN, negative for SPEND
    private String source; // "ACTIVITY", "OCR", "CHALLENGE", "REDEMPTION"
    
    @Column(length = 64)
    private String documentHash; // SHA-256 hash for OCR deduplication
    
    private LocalDateTime recordedAt;

    public CarbonLedgerEntity() {
    }

    public CarbonLedgerEntity(Long walletId, String type, String description, Integer amount, String source, String documentHash, LocalDateTime recordedAt) {
        this.walletId = walletId;
        this.type = type;
        this.description = description;
        this.amount = amount;
        this.source = source;
        this.documentHash = documentHash;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWalletId() {
        return walletId;
    }

    public void setWalletId(Long walletId) {
        this.walletId = walletId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDocumentHash() {
        return documentHash;
    }

    public void setDocumentHash(String documentHash) {
        this.documentHash = documentHash;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
