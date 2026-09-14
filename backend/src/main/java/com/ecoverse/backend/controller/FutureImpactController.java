package com.ecoverse.backend.controller;

import com.ecoverse.backend.dto.FutureImpactDTO;
import com.ecoverse.backend.service.FutureImpactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/future-impact")
@CrossOrigin(origins = "*")
public class FutureImpactController {

    private final FutureImpactService futureImpactService;

    @Autowired
    public FutureImpactController(FutureImpactService futureImpactService) {
        this.futureImpactService = futureImpactService;
    }

    @GetMapping
    public FutureImpactDTO getFutureImpact() {
        return futureImpactService.getFutureImpactProjections();
    }
}
