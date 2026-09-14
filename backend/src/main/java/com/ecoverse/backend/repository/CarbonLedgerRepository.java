package com.ecoverse.backend.repository;

import com.ecoverse.backend.entity.CarbonLedgerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarbonLedgerRepository extends JpaRepository<CarbonLedgerEntity, Long> {
    List<CarbonLedgerEntity> findByWalletIdOrderByRecordedAtDesc(Long walletId);
    boolean existsByDocumentHash(String documentHash);
}
