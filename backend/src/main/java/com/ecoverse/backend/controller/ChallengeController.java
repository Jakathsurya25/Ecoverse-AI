package com.ecoverse.backend.controller;

import com.ecoverse.backend.dto.ChallengeDTO;
import com.ecoverse.backend.entity.ChallengeProgressEntity;
import com.ecoverse.backend.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    private final ChallengeService challengeService;

    @Autowired
    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public List<ChallengeDTO> getActiveChallenges() {
        return challengeService.getActiveChallengesWithProgress();
    }

    @GetMapping("/progress")
    public List<ChallengeProgressEntity> getProgress() {
        return challengeService.getRawProgress();
    }

    @PostMapping("/{id}/complete")
    public ChallengeDTO completeChallenge(@PathVariable("id") Long id) {
        return challengeService.completeChallenge(id);
    }
}
