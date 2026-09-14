package com.ecoverse.backend.service;

import com.ecoverse.backend.dto.FutureImpactDTO;
import com.ecoverse.backend.entity.ActivityEntity;
import com.ecoverse.backend.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
public class FutureImpactService {

    private final ActivityRepository activityRepository;

    @Autowired
    public FutureImpactService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public FutureImpactDTO getFutureImpactProjections() {
        List<ActivityEntity> activities = activityRepository.findAll();

        if (activities.isEmpty()) {
            return new FutureImpactDTO(
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    "No activity history recorded yet. Log an activity to generate personalized future impact projections."
            );
        }

        double totalCo2 = activities.stream()
                .mapToDouble(a -> a.getEstimatedCo2EmissionsKg() != null ? a.getEstimatedCo2EmissionsKg() : 0.0)
                .sum();

        // Determine calendar day span based on actual recordedAt timestamps
        LocalDateTime minDate = activities.stream()
                .map(ActivityEntity::getRecordedAt)
                .filter(dt -> dt != null)
                .min(Comparator.naturalOrder())
                .orElse(LocalDateTime.now());

        LocalDateTime maxDate = activities.stream()
                .map(ActivityEntity::getRecordedAt)
                .filter(dt -> dt != null)
                .max(Comparator.naturalOrder())
                .orElse(LocalDateTime.now());

        long daysSpan = Math.max(1, ChronoUnit.DAYS.between(minDate.toLocalDate(), maxDate.toLocalDate()) + 1);

        double dailyAvgCo2 = totalCo2 / daysSpan;
        double projectedMonthly = Math.round(dailyAvgCo2 * 30.0 * 100.0) / 100.0;
        double projectedYearly = Math.round(dailyAvgCo2 * 365.0 * 100.0) / 100.0;
        double potentialReduction = 25.0; // Hypothetical improvement scenario
        double projectedSavings = Math.round(projectedYearly * (potentialReduction / 100.0) * 100.0) / 100.0;

        String message = String.format(
                "Hypothetical scenario: Projections estimated from %.2f kg CO2 logged across %d calendar day(s) (%s to %s).",
                totalCo2, daysSpan, minDate.toLocalDate().toString(), maxDate.toLocalDate().toString()
        );

        return new FutureImpactDTO(
                Math.round(totalCo2 * 100.0) / 100.0,
                projectedMonthly,
                projectedYearly,
                potentialReduction,
                projectedSavings,
                message
        );
    }
}
