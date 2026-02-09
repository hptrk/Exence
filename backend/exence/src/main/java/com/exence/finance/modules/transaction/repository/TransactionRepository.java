package com.exence.finance.modules.transaction.repository;

import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.Transaction;
import java.math.BigDecimal;
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

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type")
    BigDecimal sumByType(@Param("type") TransactionType type);
}
