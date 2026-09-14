package com.ecoverse.backend.repository;

import com.ecoverse.backend.entity.RewardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<RewardEntity, Long> {
    List<RewardEntity> findByAvailableTrue();
}
