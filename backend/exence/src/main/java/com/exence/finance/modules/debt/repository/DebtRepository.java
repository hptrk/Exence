package com.exence.finance.modules.debt.repository;

import com.exence.finance.modules.debt.entity.Debt;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
@JaversSpringDataAuditable
public interface DebtRepository extends JpaRepository<Debt, Long> {

    @Query("SELECT d FROM Debt d WHERE d.id = :id")
    Optional<Debt> find(Long id);

    @Query("SELECT d FROM Debt d")
    List<Debt> findAllWorkspaceFiltered();

    @Query("SELECT d FROM Debt d WHERE d.status IN :statuses")
    List<Debt> findByStatusIn(List<DebtStatus> statuses);

    @Query("SELECT d FROM Debt d WHERE d.type = :type")
    List<Debt> findByType(DebtType type);

    @Query("SELECT d FROM Debt d WHERE d.status IN :statuses AND d.type = :type")
    List<Debt> findByStatusInAndType(List<DebtStatus> statuses, DebtType type);

    @Query("SELECT COALESCE(SUM(d.remainingBaseCurrencyAmount), 0) FROM Debt d "
            + "WHERE d.type = :type AND d.status = :status")
    BigDecimal sumRemainingBaseCurrencyAmountByTypeAndStatus(DebtType type, DebtStatus status);

    @Modifying
    @Query("UPDATE Debt d SET d.status = :newStatus "
            + "WHERE d.deadline IS NOT NULL "
            + "AND d.deadline < :today "
            + "AND d.status = :activeStatus")
    int expireOverdueDebts(DebtStatus newStatus, LocalDate today, DebtStatus activeStatus);

    @Query("SELECT COUNT(d) FROM Debt d WHERE d.workspace.id = :workspaceId")
    long countAllByWorkspaceId(Long workspaceId);

    @Query("SELECT COUNT(d) FROM Debt d WHERE d.workspace.id = :workspaceId AND d.status = :status")
    long countByWorkspaceIdAndStatus(Long workspaceId, DebtStatus status);
}
