package com.ecoverse.backend.repository;

import com.ecoverse.backend.entity.ChallengeProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeProgressRepository extends JpaRepository<ChallengeProgressEntity, Long> {
    Optional<ChallengeProgressEntity> findByChallengeId(Long challengeId);
    List<ChallengeProgressEntity> findByChallengeIdIn(List<Long> challengeIds);
}
