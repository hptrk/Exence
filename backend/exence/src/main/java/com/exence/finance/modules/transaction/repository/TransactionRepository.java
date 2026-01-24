package com.exence.finance.modules.transaction.repository;

import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, QuerydslPredicateExecutor<Transaction> {

    @Query("SELECT t FROM Transaction t WHERE t.id = :id")
    Optional<Transaction> find(@Param("id") Long id);

    @Query("SELECT t FROM Transaction t WHERE " +
            "t.recurring = true " +
            "AND t.type = :type " +
            "ORDER BY t.date DESC")
    Page<Transaction> findRecurringByType(
            @Param("type") TransactionType type,
            Pageable pageable
    );

    @Query("SELECT t FROM Transaction t WHERE " +
            "t.recurring = true " +
            "ORDER BY t.date DESC")
    Page<Transaction> findAllRecurring(Pageable pageable);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type")
    BigDecimal sumByType(@Param("type") TransactionType type);
}
