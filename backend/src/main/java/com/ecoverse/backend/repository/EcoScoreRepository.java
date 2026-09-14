package com.ecoverse.backend.repository;

import com.ecoverse.backend.entity.EcoScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EcoScoreRepository extends JpaRepository<EcoScoreEntity, Long> {
}
