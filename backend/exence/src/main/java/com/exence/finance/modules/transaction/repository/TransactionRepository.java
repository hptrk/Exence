package com.exence.finance.modules.transaction.repository;

import com.exence.finance.modules.statistics.dto.projection.ScatterProjection;
import com.exence.finance.modules.statistics.dto.projection.TopTransactionProjection;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.Transaction;
import java.math.BigDecimal;
import java.time.Instant;
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

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type")
    BigDecimal sumByType(@Param("type") TransactionType type);

    // --- Chart queries ---

    @Query("""
        SELECT t.date AS transactionDate, t.amount AS amount,
               t.category.name AS categoryName, t.category.color AS categoryColor
        FROM Transaction t
        WHERE t.date BETWEEN :startDate AND :endDate
          AND t.type = :type
        ORDER BY t.date
        """)
    List<ScatterProjection> findScatterData(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    @Query(value = """
        SELECT c.name AS "categoryName", c.color AS "categoryColor",
               MIN(t.amount) AS "minVal",
               PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY t.amount) AS "q1",
               PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY t.amount) AS "median",
               PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY t.amount) AS "q3",
               MAX(t.amount) AS "maxVal"
        FROM "transaction" t
        JOIN category c ON t.category_id = c.id
        WHERE t.user_id = :userId
          AND t.date BETWEEN :startDate AND :endDate
          AND CAST(t.type AS TEXT) = :#{T(com.exence.finance.modules.transaction.dto.TransactionType).EXPENSE.name()}
        GROUP BY c.name, c.color
        ORDER BY c.name
        """, nativeQuery = true)
    List<Object[]> findBoxplotByExpenseCategory(
            @Param("userId") Long userId, @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    // --- Stat card queries ---

    @Query("""
        SELECT t.amount AS amount, t.title AS title, t.category.color AS categoryColor
        FROM Transaction t
        WHERE t.date BETWEEN :startDate AND :endDate
          AND t.type = :type
        ORDER BY t.amount DESC
        LIMIT 1
        """)
    TopTransactionProjection findTopTransactionByType(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);
}
