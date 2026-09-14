package com.ecoverse.backend.controller;

import com.ecoverse.backend.dto.EcoScoreDTO;
import com.ecoverse.backend.dto.EcoScoreUpdateRequestDTO;
import com.ecoverse.backend.service.EcoScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eco-score")
@CrossOrigin(origins = "*")
public class EcoScoreController {

    private final EcoScoreService ecoScoreService;

    @Autowired
    public EcoScoreController(EcoScoreService ecoScoreService) {
        this.ecoScoreService = ecoScoreService;
    }

    @GetMapping
    public EcoScoreDTO getEcoScore() {
        return ecoScoreService.getCurrentScore();
    }

    @PostMapping("/update")
    public EcoScoreDTO updateEcoScore(@RequestBody EcoScoreUpdateRequestDTO request) {
        int impact = request.getImpact() != null ? request.getImpact() : 0;
        return ecoScoreService.applyImpact(impact);
    }
}
