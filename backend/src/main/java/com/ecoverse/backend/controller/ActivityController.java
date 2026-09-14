package com.ecoverse.backend.controller;

import com.ecoverse.backend.dto.ActivityRequestDTO;
import com.ecoverse.backend.dto.ActivityResponseDTO;
import com.ecoverse.backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<ActivityResponseDTO> createActivity(@RequestBody ActivityRequestDTO request) {
        ActivityResponseDTO response = activityService.recordActivity(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponseDTO>> getAllActivities() {
        List<ActivityResponseDTO> activities = activityService.getAllActivities();
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/today")
    public ResponseEntity<List<ActivityResponseDTO>> getTodayActivities() {
        List<ActivityResponseDTO> todayActivities = activityService.getTodayActivities();
        return ResponseEntity.ok(todayActivities);
    }

    @GetMapping("/summary")
    public ResponseEntity<com.ecoverse.backend.dto.AnalyticsSummaryDTO> getAnalyticsSummary() {
        com.ecoverse.backend.dto.AnalyticsSummaryDTO summary = activityService.getAnalyticsSummary();
        return ResponseEntity.ok(summary);
    }
}
