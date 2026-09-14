package com.ecoverse.backend.service;

import com.ecoverse.backend.dto.ChallengeDTO;
import com.ecoverse.backend.entity.ActivityEntity;
import com.ecoverse.backend.entity.ChallengeEntity;
import com.ecoverse.backend.entity.ChallengeProgressEntity;
import com.ecoverse.backend.repository.ActivityRepository;
import com.ecoverse.backend.repository.ChallengeProgressRepository;
import com.ecoverse.backend.repository.ChallengeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    private static final Set<String> LOW_EMISSION_MODES = Set.of(
            "WALK", "BICYCLE", "BIKE", "BUS", "TRAIN", "EV", "ELECTRIC"
    );

    private final ChallengeRepository challengeRepository;
    private final ChallengeProgressRepository challengeProgressRepository;
    private final ActivityRepository activityRepository;
    private final WalletService walletService;

    @Autowired
    public ChallengeService(ChallengeRepository challengeRepository,
                            ChallengeProgressRepository challengeProgressRepository,
                            ActivityRepository activityRepository,
                            WalletService walletService) {
        this.challengeRepository = challengeRepository;
        this.challengeProgressRepository = challengeProgressRepository;
        this.activityRepository = activityRepository;
        this.walletService = walletService;
    }

    @PostConstruct
    @Transactional
    public void initPrototypeChallenges() {
        if (challengeRepository.count() == 0) {
            List<ChallengeEntity> seededChallenges = List.of(
                    new ChallengeEntity(
                            "Low-Emission Commute",
                            "Travel 5 km using low-emission options (Walk, Bicycle, Bus, Train, EV).",
                            "TRANSPORT",
                            5.0,
                            "km",
                            120,
                            "EASY",
                            true,
                            LocalDateTime.now()
                    ),
                    new ChallengeEntity(
                            "Clean Transit CO₂ Saver",
                            "Save at least 2 kg of CO₂ emissions through clean transit choices.",
                            "TRANSPORT",
                            2.0,
                            "kg CO₂",
                            150,
                            "MEDIUM",
                            true,
                            LocalDateTime.now()
                    ),
                    new ChallengeEntity(
                            "Active Eco Logger",
                            "Log at least 3 eco-friendly activities to build your carbon accounting history.",
                            "LOGGING",
                            3.0,
                            "activities",
                            80,
                            "EASY",
                            true,
                            LocalDateTime.now()
                    ),
                    new ChallengeEntity(
                            "Multi-Category Audit",
                            "Audit your footprint across 3 distinct resource categories.",
                            "AUDIT",
                            3.0,
                            "categories",
                            100,
                            "MEDIUM",
                            true,
                            LocalDateTime.now()
                    ),
                    new ChallengeEntity(
                            "Multi-Day Eco Streak",
                            "Log sustainable activities on at least 2 distinct calendar days.",
                            "STREAK",
                            2.0,
                            "days",
                            90,
                            "EASY",
                            true,
                            LocalDateTime.now()
                    )
            );
            challengeRepository.saveAll(seededChallenges);
        }
    }

    @Transactional
    public List<ChallengeDTO> getActiveChallengesWithProgress() {
        // First recalculate progress across active challenges
        evaluateAllChallenges();

        List<ChallengeEntity> challenges = challengeRepository.findByActiveTrue();
        List<Long> ids = challenges.stream().map(ChallengeEntity::getId).collect(Collectors.toList());
        Map<Long, ChallengeProgressEntity> progressMap = challengeProgressRepository.findByChallengeIdIn(ids).stream()
                .collect(Collectors.toMap(ChallengeProgressEntity::getChallengeId, p -> p, (p1, p2) -> p1));

        return challenges.stream().map(c -> {
            ChallengeProgressEntity progress = progressMap.get(c.getId());
            double progressVal = progress != null && progress.getProgressValue() != null ? progress.getProgressValue() : 0.0;
            boolean completed = progress != null && Boolean.TRUE.equals(progress.getCompleted());
            LocalDateTime completedAt = progress != null ? progress.getCompletedAt() : null;

            int pts = getPointsForChallenge(c.getTitle());
            return new ChallengeDTO(
                    c.getId(),
                    c.getTitle(),
                    c.getDescription(),
                    c.getCategory(),
                    c.getTargetValue(),
                    c.getUnit(),
                    c.getEcoCoinsReward(),
                    pts,
                    c.getDifficulty(),
                    Math.round(progressVal * 100.0) / 100.0,
                    completed,
                    completedAt,
                    completed ? "Challenge Completed!" : "In Progress (" + Math.round(progressVal * 10.0) / 10.0 + "/" + c.getTargetValue() + " " + c.getUnit() + ")"
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<ChallengeProgressEntity> getRawProgress() {
        evaluateAllChallenges();
        return challengeProgressRepository.findAll();
    }

    @Transactional
    public void evaluateAllChallenges() {
        List<ChallengeEntity> activeChallenges = challengeRepository.findByActiveTrue();
        if (activeChallenges.isEmpty()) return;

        List<ActivityEntity> activities = activityRepository.findAll();

        for (ChallengeEntity challenge : activeChallenges) {
            ChallengeProgressEntity progress = challengeProgressRepository.findByChallengeId(challenge.getId())
                    .orElseGet(() -> new ChallengeProgressEntity(challenge.getId(), 0.0, false, null));

            double computedProgress = calculateProgressForChallenge(challenge, activities);
            progress.setProgressValue(computedProgress);

            if (!Boolean.TRUE.equals(progress.getCompleted()) && computedProgress >= challenge.getTargetValue()) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
                challengeProgressRepository.save(progress);

                walletService.addEarnedCoins(
                        challenge.getEcoCoinsReward(),
                        "Completed Challenge: " + challenge.getTitle(),
                        "CHALLENGE",
                        null
                );
            } else {
                challengeProgressRepository.save(progress);
            }
        }
    }

    @Transactional
    public ChallengeDTO completeChallenge(Long challengeId) {
        ChallengeEntity challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge not found with id: " + challengeId));

        ChallengeProgressEntity progress = challengeProgressRepository.findByChallengeId(challengeId)
                .orElseGet(() -> new ChallengeProgressEntity(challengeId, 0.0, false, null));

        if (Boolean.TRUE.equals(progress.getCompleted())) {
            return mapToDTO(challenge, progress, "Challenge is already completed.");
        }

        List<ActivityEntity> activities = activityRepository.findAll();
        double currentProgress = calculateProgressForChallenge(challenge, activities);
        progress.setProgressValue(currentProgress);

        if (currentProgress < challenge.getTargetValue()) {
            challengeProgressRepository.save(progress);
            return mapToDTO(challenge, progress, "Target not reached yet (" + Math.round(currentProgress * 10.0) / 10.0 + "/" + challenge.getTargetValue() + " " + challenge.getUnit() + "). Keep logging activities!");
        }

        // Target reached: complete and credit coins exactly once
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        challengeProgressRepository.save(progress);

        walletService.addEarnedCoins(
                challenge.getEcoCoinsReward(),
                "Completed Challenge: " + challenge.getTitle(),
                "CHALLENGE",
                null
        );

        return mapToDTO(challenge, progress, "Challenge successfully completed! Earned " + challenge.getEcoCoinsReward() + " EcoCoins!");
    }

    public double calculateProgressForChallenge(ChallengeEntity challenge, List<ActivityEntity> activities) {
        if (activities == null || activities.isEmpty()) {
            return 0.0;
        }

        String title = challenge.getTitle() != null ? challenge.getTitle().trim() : "";

        if (title.equalsIgnoreCase("Low-Emission Commute")) {
            return activities.stream()
                    .filter(a -> a.getTransportMode() != null && isLowEmissionMode(a.getTransportMode()))
                    .mapToDouble(a -> a.getTransportDistanceKm() != null ? a.getTransportDistanceKm() : 0.0)
                    .sum();
        }

        if (title.equalsIgnoreCase("Clean Transit CO₂ Saver")) {
            return activities.stream()
                    .mapToDouble(a -> a.getCo2SavedTransport() != null ? a.getCo2SavedTransport() : 0.0)
                    .sum();
        }

        if (title.equalsIgnoreCase("Active Eco Logger")) {
            return (double) activities.size();
        }

        if (title.equalsIgnoreCase("Multi-Category Audit")) {
            Set<String> categoryLogged = new HashSet<>();
            for (ActivityEntity a : activities) {
                if (a.getTransportDistanceKm() != null && a.getTransportDistanceKm() > 0) categoryLogged.add("TRANSPORT");
                if (a.getElectricityKwh() != null && a.getElectricityKwh() > 0) categoryLogged.add("ENERGY");
                if (a.getWaterLitres() != null && a.getWaterLitres() > 0) categoryLogged.add("WATER");
                if (a.getPlasticKg() != null && a.getPlasticKg() > 0) categoryLogged.add("PLASTIC");
                if (a.getWasteKg() != null && a.getWasteKg() > 0) categoryLogged.add("WASTE");
            }
            return (double) categoryLogged.size();
        }

        if (title.equalsIgnoreCase("Multi-Day Eco Streak")) {
            return (double) activities.stream()
                    .filter(a -> a.getRecordedAt() != null)
                    .map(a -> a.getRecordedAt().toLocalDate())
                    .distinct()
                    .count();
        }

        return 0.0;
    }

    private boolean isLowEmissionMode(String mode) {
        if (mode == null) return false;
        String upper = mode.trim().toUpperCase();
        return LOW_EMISSION_MODES.stream().anyMatch(upper::contains);
    }

    private int getPointsForChallenge(String title) {
        if (title == null) return 50;
        if (title.equalsIgnoreCase("Clean Transit CO₂ Saver")) return 60;
        if (title.equalsIgnoreCase("Active Eco Logger")) return 30;
        if (title.equalsIgnoreCase("Multi-Category Audit")) return 40;
        if (title.equalsIgnoreCase("Multi-Day Eco Streak")) return 35;
        return 50;
    }

    private ChallengeDTO mapToDTO(ChallengeEntity c, ChallengeProgressEntity progress, String message) {
        double progressVal = progress != null && progress.getProgressValue() != null ? progress.getProgressValue() : 0.0;
        boolean completed = progress != null && Boolean.TRUE.equals(progress.getCompleted());
        LocalDateTime completedAt = progress != null ? progress.getCompletedAt() : null;

        return new ChallengeDTO(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.getCategory(),
                c.getTargetValue(),
                c.getUnit(),
                c.getEcoCoinsReward(),
                getPointsForChallenge(c.getTitle()),
                c.getDifficulty(),
                Math.round(progressVal * 100.0) / 100.0,
                completed,
                completedAt,
                message
        );
    }
}
