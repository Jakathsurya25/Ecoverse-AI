package com.ecoverse.backend.repository;

import com.ecoverse.backend.entity.ActivityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<ActivityEntity, Long> {
    List<ActivityEntity> findByRecordedAtBetween(LocalDateTime start, LocalDateTime end);
}
