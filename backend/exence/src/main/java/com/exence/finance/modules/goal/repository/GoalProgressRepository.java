package com.exence.finance.modules.goal.repository;

import com.exence.finance.modules.goal.entity.GoalProgressHistory;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalProgressRepository extends JpaRepository<GoalProgressHistory, Long> {

    List<GoalProgressHistory> findByGoalIdOrderByRecordedAt(Long goalId);

    @Query("SELECT h FROM GoalProgressHistory h WHERE h.goal.id = :goalId AND h.recordedAt < :before "
            + "ORDER BY h.recordedAt DESC LIMIT 1")
    Optional<GoalProgressHistory> findLastBeforeInstant(Long goalId, Instant before);

    @Query("SELECT h FROM GoalProgressHistory h WHERE h.goal.id IN :goalIds "
            + "AND h.recordedAt >= :start AND h.recordedAt <= :end ORDER BY h.goal.id, h.recordedAt ASC")
    List<GoalProgressHistory> findAllInPeriodForGoals(List<Long> goalIds, Instant start, Instant end);
}
