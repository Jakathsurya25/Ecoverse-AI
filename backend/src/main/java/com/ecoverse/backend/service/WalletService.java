package com.ecoverse.backend.service;

import com.ecoverse.backend.dto.*;
import com.ecoverse.backend.entity.CarbonLedgerEntity;
import com.ecoverse.backend.entity.RewardEntity;
import com.ecoverse.backend.entity.WalletEntity;
import com.ecoverse.backend.repository.CarbonLedgerRepository;
import com.ecoverse.backend.repository.RewardRepository;
import com.ecoverse.backend.repository.WalletRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletService {

    private static final Long PROTOTYPE_WALLET_ID = 1L;

    private final WalletRepository walletRepository;
    private final CarbonLedgerRepository carbonLedgerRepository;
    private final RewardRepository rewardRepository;

    @Autowired
    public WalletService(WalletRepository walletRepository,
                         CarbonLedgerRepository carbonLedgerRepository,
                         RewardRepository rewardRepository) {
        this.walletRepository = walletRepository;
        this.carbonLedgerRepository = carbonLedgerRepository;
        this.rewardRepository = rewardRepository;
    }

    @PostConstruct
    @Transactional
    public void initPrototypeWallet() {
        if (!walletRepository.existsById(PROTOTYPE_WALLET_ID)) {
            WalletEntity wallet = new WalletEntity(
                    PROTOTYPE_WALLET_ID,
                    2450,
                    2950,
                    2.45,
                    1,
                    "1 Tree Planted",
                    LocalDateTime.now()
            );
            walletRepository.save(wallet);
        }

        if (rewardRepository.count() == 0) {
            List<RewardEntity> rewards = List.of(
                    new RewardEntity("Plant 1 Tree (WWF)", "We'll plant a real mangrove tree in Kenya. Includes digital tree log.", 500, "tree", true),
                    new RewardEntity("$10 Donation to Greenpeace", "Contribute to ocean conservation and anti-plastic campaigns.", 1000, "ngo", true),
                    new RewardEntity("Eco-Friendly Bamboo Tumbler", "A double-insulated tumbler to replace single-use coffee cups.", 800, "product", true),
                    new RewardEntity("100kg CO₂ Carbon Offset", "Purchase certified carbon credits to offset your transport activities.", 400, "offset", true)
            );
            rewardRepository.saveAll(rewards);
        }

        if (carbonLedgerRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();
            List<CarbonLedgerEntity> initialLedger = List.of(
                    new CarbonLedgerEntity(PROTOTYPE_WALLET_ID, "EARN", "Recycling Photo Upload (PET Plastic)", 15, "OCR", null, now.minusHours(2)),
                    new CarbonLedgerEntity(PROTOTYPE_WALLET_ID, "EARN", "Completed Challenge: Plant-Based Power", 150, "CHALLENGE", null, now.minusHours(5)),
                    new CarbonLedgerEntity(PROTOTYPE_WALLET_ID, "EARN", "Utility Bill OCR Bonus", 100, "OCR", null, now.minusDays(1)),
                    new CarbonLedgerEntity(PROTOTYPE_WALLET_ID, "SPEND", "Redemption: Plant 1 Tree (WWF Initiative)", -500, "REDEMPTION", null, now.minusDays(2)),
                    new CarbonLedgerEntity(PROTOTYPE_WALLET_ID, "EARN", "Completed Challenge: Phantom Load Patrol", 80, "CHALLENGE", null, now.minusDays(3))
            );
            carbonLedgerRepository.saveAll(initialLedger);
        }
    }

    public WalletResponseDTO getWallet() {
        WalletEntity wallet = walletRepository.findById(PROTOTYPE_WALLET_ID)
                .orElseGet(() -> {
                    initPrototypeWallet();
                    return walletRepository.findById(PROTOTYPE_WALLET_ID).orElseThrow();
                });

        return new WalletResponseDTO(
                wallet.getId(),
                wallet.getBalance(),
                wallet.getLifetimeEarned(),
                wallet.getEquivalentOffsetsTons(),
                wallet.getTreesPlanted(),
                wallet.getRealWorldImpactText()
        );
    }

    public List<LedgerTransactionDTO> getLedger() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        return carbonLedgerRepository.findByWalletIdOrderByRecordedAtDesc(PROTOTYPE_WALLET_ID).stream()
                .map(entity -> {
                    String formattedDate;
                    if (entity.getRecordedAt() != null) {
                        if (entity.getRecordedAt().toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
                            formattedDate = "Today";
                        } else if (entity.getRecordedAt().toLocalDate().equals(LocalDateTime.now().minusDays(1).toLocalDate())) {
                            formattedDate = "Yesterday";
                        } else {
                            formattedDate = entity.getRecordedAt().format(formatter);
                        }
                    } else {
                        formattedDate = "Recently";
                    }

                    return new LedgerTransactionDTO(
                            entity.getId(),
                            entity.getDescription(),
                            entity.getAmount(),
                            entity.getType(),
                            entity.getSource(),
                            formattedDate,
                            entity.getRecordedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<RewardDTO> getRewards() {
        return rewardRepository.findAll().stream()
                .map(entity -> new RewardDTO(
                        entity.getId(),
                        entity.getTitle(),
                        entity.getDescription(),
                        entity.getCost(),
                        entity.getRewardType(),
                        entity.getAvailable()
                ))
                .collect(Collectors.toList());
    }

    public boolean hasDocumentHashBeenRewarded(String documentHash) {
        if (documentHash == null || documentHash.trim().isEmpty()) {
            return false;
        }
        return carbonLedgerRepository.existsByDocumentHash(documentHash.trim());
    }

    @Transactional
    public void addEarnedCoins(int amount, String description, String source, String documentHash) {
        if (amount <= 0) return;

        // Hash deduplication check for OCR
        if (documentHash != null && !documentHash.trim().isEmpty() && hasDocumentHashBeenRewarded(documentHash)) {
            return;
        }

        WalletEntity wallet = walletRepository.findById(PROTOTYPE_WALLET_ID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prototype wallet not found."));

        wallet.setBalance(wallet.getBalance() + amount);
        wallet.setLifetimeEarned(wallet.getLifetimeEarned() + amount);
        
        // Prototype equivalent offset formula: lifetimeEarned * 0.001 tons
        double updatedOffsets = Math.round((wallet.getLifetimeEarned() * 0.001) * 100.0) / 100.0;
        wallet.setEquivalentOffsetsTons(updatedOffsets);
        wallet.setUpdatedAt(LocalDateTime.now());

        walletRepository.save(wallet);

        CarbonLedgerEntity ledgerEntry = new CarbonLedgerEntity(
                PROTOTYPE_WALLET_ID,
                "EARN",
                description,
                amount,
                source,
                documentHash,
                LocalDateTime.now()
        );

        carbonLedgerRepository.save(ledgerEntry);
    }

    @Transactional
    public RedeemResponseDTO redeemReward(RedeemRequestDTO request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Redemption request cannot be null.");
        }

        RewardEntity reward = null;
        if (request.getRewardId() != null) {
            reward = rewardRepository.findById(request.getRewardId()).orElse(null);
        }
        if (reward == null && request.getRewardTitle() != null && !request.getRewardTitle().trim().isEmpty()) {
            String titleQuery = request.getRewardTitle().trim();
            reward = rewardRepository.findAll().stream()
                    .filter(r -> r.getTitle().equalsIgnoreCase(titleQuery))
                    .findFirst()
                    .orElse(null);
        }

        if (reward == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reward item not found.");
        }

        if (Boolean.FALSE.equals(reward.getAvailable())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reward item is currently unavailable.");
        }

        WalletEntity wallet = walletRepository.findById(PROTOTYPE_WALLET_ID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prototype wallet not found."));

        if (wallet.getBalance() < reward.getCost()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient EcoCoins balance.");
        }

        // Deduct balance atomically
        int newBalance = wallet.getBalance() - reward.getCost();
        wallet.setBalance(newBalance);
        wallet.setUpdatedAt(LocalDateTime.now());

        // Update real-world impact metrics ONLY when reward explicitly represents that action
        if ("tree".equalsIgnoreCase(reward.getRewardType()) || reward.getTitle().toLowerCase().contains("tree")) {
            int updatedTrees = wallet.getTreesPlanted() + 1;
            wallet.setTreesPlanted(updatedTrees);
            wallet.setRealWorldImpactText(updatedTrees + " Tree" + (updatedTrees > 1 ? "s" : "") + " Planted");
        }

        walletRepository.save(wallet);

        CarbonLedgerEntity ledgerEntry = new CarbonLedgerEntity(
                PROTOTYPE_WALLET_ID,
                "SPEND",
                "Redemption: " + reward.getTitle(),
                -reward.getCost(),
                "REDEMPTION",
                null,
                LocalDateTime.now()
        );

        carbonLedgerRepository.save(ledgerEntry);

        return new RedeemResponseDTO(
                true,
                "Redemption Approved! Successfully redeemed " + reward.getTitle() + ". Your EcoCoins balance has been updated.",
                wallet.getBalance(),
                reward.getTitle()
        );
    }
}
