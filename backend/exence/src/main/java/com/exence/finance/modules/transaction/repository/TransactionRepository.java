package com.exence.finance.modules.transaction.repository;

import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.Transaction;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository
        extends JpaRepository<Transaction, Long>, QuerydslPredicateExecutor<Transaction> {

    @Query("SELECT t FROM Transaction t WHERE t.id = :id")
    Optional<Transaction> find(@Param("id") Long id);

    @Query("SELECT COALESCE(SUM(t.baseCurrencyAmount), 0) FROM Transaction t WHERE t.type = :type")
    BigDecimal sumByType(@Param("type") TransactionType type);

    @Query("SELECT t FROM Transaction t")
    List<Transaction> findAllWorkspaceFiltered();

    @Query("SELECT COUNT(t) > 0 FROM Transaction t WHERE t.recurringTransaction.id = :rid AND t.date = :d")
    boolean existsByRecurringTransactionAndDate(@Param("rid") Long recurringTransactionId, @Param("d") LocalDate date);

    // achievement listeners need workspaceId, hibernate filter does not apply there
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.workspace.id = :workspaceId")
    long countByWorkspaceId(@Param("workspaceId") Long workspaceId);

    @Query("SELECT DISTINCT CAST(t.createdAt AS date) FROM Transaction t"
            + " WHERE t.workspace.id = :workspaceId ORDER BY CAST(t.createdAt AS date) ASC")
    List<Date> findDistinctCreatedAtByWorkspaceId(@Param("workspaceId") Long workspaceId);
}
