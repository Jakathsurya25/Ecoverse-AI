package com.ecoverse.backend.service;

import com.ecoverse.backend.dto.EcoScoreDTO;
import com.ecoverse.backend.entity.EcoScoreEntity;
import com.ecoverse.backend.repository.EcoScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EcoScoreService {

    private static final int INITIAL_SCORE = 742;
    private static final int MIN_SCORE = 0;
    private static final int MAX_SCORE = 1000;

    private final EcoScoreRepository ecoScoreRepository;

    @Autowired
    public EcoScoreService(EcoScoreRepository ecoScoreRepository) {
        this.ecoScoreRepository = ecoScoreRepository;
    }

    public synchronized EcoScoreDTO getCurrentScore() {
        EcoScoreEntity entity = getOrCreateScoreEntity();
        return new EcoScoreDTO(entity.getCurrentScore());
    }

    public synchronized EcoScoreDTO applyImpact(int impact) {
        EcoScoreEntity entity = getOrCreateScoreEntity();
        int newScore = entity.getCurrentScore() + impact;
        newScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, newScore));
        entity.setCurrentScore(newScore);
        EcoScoreEntity saved = ecoScoreRepository.save(entity);
        return new EcoScoreDTO(saved.getCurrentScore());
    }

    private EcoScoreEntity getOrCreateScoreEntity() {
        List<EcoScoreEntity> list = ecoScoreRepository.findAll();
        if (list.isEmpty()) {
            EcoScoreEntity entity = new EcoScoreEntity(INITIAL_SCORE);
            return ecoScoreRepository.save(entity);
        }
        return list.get(0);
    }
}
