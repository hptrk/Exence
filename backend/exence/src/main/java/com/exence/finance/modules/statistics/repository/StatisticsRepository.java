package com.exence.finance.modules.statistics.repository;

import com.exence.finance.modules.statistics.dto.projection.CategoryAmountProjection;
import com.exence.finance.modules.statistics.dto.projection.CategoryAverageProjection;
import com.exence.finance.modules.statistics.dto.projection.CategoryFlowProjection;
import com.exence.finance.modules.statistics.dto.projection.CategoryStatsProjection;
import com.exence.finance.modules.statistics.dto.projection.DailyTrendProjection;
import com.exence.finance.modules.statistics.dto.projection.HeatmapProjection;
import com.exence.finance.modules.statistics.dto.projection.MonthlyBalanceProjection;
import com.exence.finance.modules.statistics.dto.projection.MonthlyCategoryProjection;
import com.exence.finance.modules.statistics.dto.projection.MonthlyIncomeExpenseProjection;
import com.exence.finance.modules.statistics.dto.projection.TypeAmountProjection;
import com.exence.finance.modules.statistics.dto.projection.YearlyCategoryProjection;
import com.exence.finance.modules.statistics.entity.DailyCategoryStat;
import com.exence.finance.modules.statistics.entity.DailyCategoryStatId;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StatisticsRepository extends JpaRepository<DailyCategoryStat, DailyCategoryStatId> {

    // --- General ---

    @Query("""
        SELECT MIN(s.id.statDate)
        FROM DailyCategoryStat s
        """)
    Instant findEarliestStatDate();

    // --- Type-level totals ---

    @Query(
            """
        SELECT s.id.type AS type, COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
        GROUP BY s.id.type
        """)
    List<TypeAmountProjection> sumByType(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    // --- Daily trends ---

    @Query(
            """
        SELECT s.id.statDate AS statDate, COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY s.id.statDate
        ORDER BY s.id.statDate
        """)
    List<DailyTrendProjection> findDailyTrendByType(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    @Query(
            value =
                    """
        SELECT daily.stat_date AS "statDate",
               SUM(daily.daily_balance) OVER (ORDER BY daily.stat_date) AS "totalAmount"
        FROM (
            SELECT stat_date,
                   SUM(CASE WHEN
                    CAST(type AS TEXT) = :#{T(com.exence.finance.modules.transaction.dto.TransactionType).INCOME.name()}
                    THEN total_amount ELSE -total_amount END) AS daily_balance
            FROM mv_daily_category_stat
            WHERE user_id = :userId
              AND stat_date BETWEEN :startDate AND :endDate
            GROUP BY stat_date
        ) daily
        ORDER BY daily.stat_date
        """,
            nativeQuery = true)
    List<DailyTrendProjection> findCumulativeDailyBalance(
            @Param("userId") Long userId, @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    // --- Monthly aggregations ---

    @Query(
            """
        SELECT year(s.id.statDate) AS statYear, month(s.id.statDate) AS statMonth,
               COALESCE(SUM(CASE WHEN s.id.type =
                       :#{T(com.exence.finance.modules.transaction.dto.TransactionType).INCOME}
                   THEN s.totalAmount ELSE -s.totalAmount END), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
        GROUP BY year(s.id.statDate), month(s.id.statDate)
        ORDER BY year(s.id.statDate), month(s.id.statDate)
        """)
    List<MonthlyBalanceProjection> findMonthlyBalance(
            @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
            """
        SELECT year(s.id.statDate) AS statYear, month(s.id.statDate) AS statMonth,
               COALESCE(SUM(CASE WHEN s.id.type =
                       :#{T(com.exence.finance.modules.transaction.dto.TransactionType).INCOME}
            THEN s.totalAmount ELSE 0.0 END), 0) AS incomeAmount,
        COALESCE(SUM(CASE WHEN s.id.type <>
                :#{T(com.exence.finance.modules.transaction.dto.TransactionType).INCOME}
            THEN s.totalAmount ELSE 0.0 END), 0) AS expenseAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
        GROUP BY year(s.id.statDate), month(s.id.statDate)
        ORDER BY year(s.id.statDate), month(s.id.statDate)
        """)
    List<MonthlyIncomeExpenseProjection> findMonthlyIncomeExpense(
            @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
            """
        SELECT year(s.id.statDate) AS statYear, month(s.id.statDate) AS statMonth,
               COALESCE(SUM(CASE WHEN s.id.type =
                       :#{T(com.exence.finance.modules.transaction.dto.TransactionType).INCOME}
                   THEN s.totalAmount ELSE 0.0 END), 0) AS incomeAmount,
               COALESCE(SUM(CASE WHEN s.id.type <>
                       :#{T(com.exence.finance.modules.transaction.dto.TransactionType).INCOME}
                   THEN s.totalAmount ELSE 0.0 END), 0) AS expenseAmount,
               COALESCE(SUM(s.transactionCount), 0) AS transactionCount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
        GROUP BY year(s.id.statDate), month(s.id.statDate)
        ORDER BY year(s.id.statDate), month(s.id.statDate)
        """)
    List<MonthlyIncomeExpenseProjection> findMonthlyIncomeExpenseWithTransactionCount(
            @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
            """
         SELECT year(s.id.statDate) AS statYear, month(s.id.statDate) AS statMonth,
               COALESCE(MAX(s.maxAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY year(s.id.statDate), month(s.id.statDate)
        ORDER BY year(s.id.statDate), month(s.id.statDate)
        """)
    List<MonthlyBalanceProjection> findMonthlyPeakByType(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    // --- Category totals ---

    @Query(
            """
        SELECT s.id.type AS type, s.categoryName AS categoryName,
               s.categoryColor AS categoryColor, COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
        GROUP BY s.id.type, s.categoryName, s.categoryColor
        """)
    List<CategoryFlowProjection> findCategoryFlow(
            @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
            """
        SELECT s.id.type AS type, s.categoryName AS categoryName,
               s.categoryColor AS categoryColor, COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
        GROUP BY s.id.type, s.categoryName, s.categoryColor
        ORDER BY s.id.type, SUM(s.totalAmount) DESC
        """)
    List<CategoryFlowProjection> findCategoryTotalsGroupedByType(
            @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
            """
        SELECT s.categoryName AS categoryName, s.categoryColor AS categoryColor,
               COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY s.categoryName, s.categoryColor
        ORDER BY s.categoryName
        """)
    List<CategoryAmountProjection> findCategoryStatsAmount(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    @Query(
            """
        SELECT s.categoryName AS categoryName, s.categoryColor AS categoryColor,
               ROUND(CASE WHEN SUM(s.transactionCount) > 0
                   THEN SUM(s.totalAmount) / SUM(s.transactionCount)
                   ELSE 0.0 END, 2) AS avgAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY s.categoryName, s.categoryColor
        ORDER BY s.categoryName
        """)
    List<CategoryAverageProjection> findCategoryStatsAverage(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    @Query(
            """
        SELECT s.categoryName AS categoryName, s.categoryColor AS categoryColor,
               COALESCE(SUM(s.totalAmount), 0) AS totalAmount,
               COALESCE(SUM(s.transactionCount), 0) AS transactionCount,
               ROUND(CASE WHEN SUM(s.transactionCount) > 0
                   THEN SUM(s.totalAmount) / SUM(s.transactionCount)
                   ELSE 0.0 END, 2) AS avgAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY s.categoryName, s.categoryColor
        ORDER BY s.categoryName
        """)
    List<CategoryStatsProjection> findCategoryStatsAmountCountAverage(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    // --- Category trends (monthly / yearly) ---

    @Query(
            """
        SELECT s.categoryName AS categoryName, s.categoryColor AS categoryColor,
               year(s.id.statDate) AS statYear, month(s.id.statDate) AS statMonth,
               COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY s.categoryName, s.categoryColor, year(s.id.statDate), month(s.id.statDate)
        ORDER BY year(s.id.statDate), month(s.id.statDate), s.categoryName
        """)
    List<MonthlyCategoryProjection> findMonthlyCategoryTotals(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    @Query(
            """
        SELECT s.categoryName AS categoryName, s.categoryColor AS categoryColor,
               year(s.id.statDate) AS statYear,
               COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY s.categoryName, s.categoryColor, year(s.id.statDate)
        ORDER BY year(s.id.statDate), s.categoryName
        """)
    List<YearlyCategoryProjection> findYearlyCategoryTotals(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    // --- Stat card queries ---

    @Query(
            """
        SELECT COALESCE(SUM(s.totalAmount), 0)
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        """)
    BigDecimal sumAmountByType(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    @Query(
            """
        SELECT COALESCE(SUM(s.transactionCount), 0) AS transactionCount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        """)
    Long countTransactionsByType(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    @Query(
            value =
                    """
        SELECT COUNT(d.day)::bigint
        FROM generate_series(CAST(:startDate AS date), CAST(:endDate AS date), '1 day'::interval) d(day)
        LEFT JOIN mv_daily_category_stat s ON CAST(s.stat_date AS date) = d.day
            AND s.user_id = :userId
            AND CAST(s.type AS TEXT) = :#{T(com.exence.finance.modules.transaction.dto.TransactionType).EXPENSE.name()}
        WHERE s.stat_date IS NULL
        """,
            nativeQuery = true)
    Long countNoSpendDays(
            @Param("userId") Long userId, @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
            """
        SELECT s.categoryName AS categoryName, s.categoryColor AS categoryColor,
               s.categoryIcon AS categoryIcon, COALESCE(SUM(s.totalAmount), 0) AS totalAmount
        FROM DailyCategoryStat s
        WHERE s.id.statDate BETWEEN :startDate AND :endDate
          AND s.id.type = :type
        GROUP BY s.categoryName, s.categoryColor, s.categoryIcon
        ORDER BY SUM(s.totalAmount) DESC
        LIMIT 1
        """)
    CategoryAmountProjection findTopCategoryByType(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("type") TransactionType type);

    // --- Native queries (heatmap, boxplot) ---

    @Query(
            value =
                    """
        SELECT EXTRACT(ISODOW FROM stat_date)::int AS "dayOfWeek",
               EXTRACT(WEEK FROM stat_date)::int AS "weekNumber",
               COALESCE(SUM(total_amount), 0) AS "totalAmount"
        FROM mv_daily_category_stat
        WHERE user_id = :userId
          AND stat_date BETWEEN :startDate AND :endDate
          AND CAST(type AS TEXT) = :#{T(com.exence.finance.modules.transaction.dto.TransactionType).EXPENSE.name()}
        GROUP BY EXTRACT(ISODOW FROM stat_date), EXTRACT(WEEK FROM stat_date)
        ORDER BY "weekNumber", "dayOfWeek"
        """,
            nativeQuery = true)
    List<HeatmapProjection> findWeeklyHeatmapExpense(
            @Param("userId") Long userId, @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query(
            value =
                    """
        SELECT sub.yr AS "year", sub.mn AS "month",
               MIN(sub.daily_total) AS "minVal",
               PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY sub.daily_total) AS "q1",
               PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sub.daily_total) AS "median",
               PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY sub.daily_total) AS "q3",
               MAX(sub.daily_total) AS "maxVal"
        FROM (
            SELECT EXTRACT(YEAR FROM stat_date)::int AS yr,
                   EXTRACT(MONTH FROM stat_date)::int AS mn,
                   stat_date,
                   SUM(total_amount) AS daily_total
            FROM mv_daily_category_stat
            WHERE user_id = :userId
              AND stat_date BETWEEN :startDate AND :endDate
              AND CAST(type AS TEXT) = :#{T(com.exence.finance.modules.transaction.dto.TransactionType).EXPENSE.name()}
            GROUP BY stat_date
        ) sub
        GROUP BY sub.yr, sub.mn
        ORDER BY sub.yr, sub.mn
        """,
            nativeQuery = true)
    List<Object[]> findBoxplotByMonthExpense(
            @Param("userId") Long userId, @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}
