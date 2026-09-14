package com.ecoverse.backend.controller;

import com.ecoverse.backend.dto.*;
import com.ecoverse.backend.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletService walletService;

    @Autowired
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public WalletResponseDTO getWallet() {
        return walletService.getWallet();
    }

    @GetMapping("/ledger")
    public List<LedgerTransactionDTO> getLedger() {
        return walletService.getLedger();
    }

    @GetMapping("/rewards")
    public List<RewardDTO> getRewards() {
        return walletService.getRewards();
    }

    @PostMapping("/redeem")
    public RedeemResponseDTO redeemReward(@RequestBody RedeemRequestDTO request) {
        return walletService.redeemReward(request);
    }
}
