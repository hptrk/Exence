package com.exence.finance.modules.goal.repository;

import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    @Query("SELECT g FROM Goal g WHERE g.id = :id")
    Optional<Goal> find(Long id);

    @Query("SELECT g FROM Goal g WHERE g.status IN :statuses")
    List<Goal> findByStatusIn(List<GoalStatus> statuses);

    @Query("SELECT g FROM Goal g")
    List<Goal> findAllUserFiltered();

    @Query("SELECT COUNT(g) FROM Goal g WHERE g.status = :status")
    long countByStatus(GoalStatus status);

    @Query("SELECT COUNT(g) FROM Goal g")
    long countAll();

    @Query("SELECT g FROM Goal g WHERE g.status = :status AND g.deadline > :date ORDER BY g.deadline ASC LIMIT 1")
    Optional<Goal> findNextDeadlineGoal(GoalStatus status, LocalDate date);

    @Query("SELECT COALESCE(SUM(g.currentBaseCurrencyAmount), 0) FROM Goal g")
    BigDecimal sumCurrentBaseCurrencyAmount();

    @Modifying
    @Query("UPDATE Goal g SET g.status = :newStatus " + "WHERE g.deadline IS NOT NULL "
            + "AND g.deadline < :today "
            + "AND g.status IN :activeStatuses")
    int expireOverdueGoals(GoalStatus newStatus, LocalDate today, List<GoalStatus> activeStatuses);
}
