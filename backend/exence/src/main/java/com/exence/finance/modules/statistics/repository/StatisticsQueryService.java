package com.exence.finance.modules.statistics.repository;

import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.result.CategoryAmountResult;
import com.exence.finance.modules.statistics.dto.result.CategoryAverageResult;
import com.exence.finance.modules.statistics.dto.result.CategoryBoxplotResult;
import com.exence.finance.modules.statistics.dto.result.CategoryFlowResult;
import com.exence.finance.modules.statistics.dto.result.CategoryStatsResult;
import com.exence.finance.modules.statistics.dto.result.DailyTrendResult;
import com.exence.finance.modules.statistics.dto.result.HeatmapResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyBalanceResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyBoxplotResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyCategoryResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyIncomeExpenseResult;
import com.exence.finance.modules.statistics.dto.result.ScatterResult;
import com.exence.finance.modules.statistics.dto.result.TopTransactionResult;
import com.exence.finance.modules.statistics.dto.result.TypeAmountResult;
import com.exence.finance.modules.statistics.dto.result.YearlyCategoryResult;
import com.exence.finance.modules.statistics.entity.QDailyCategoryStat;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.entity.QTransaction;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatisticsQueryService {

    private static final int AVG_SCALE = 2;

    private static final QDailyCategoryStat dailyCategoryStat = QDailyCategoryStat.dailyCategoryStat;
    private static final QTransaction transaction = QTransaction.transaction;

    private final JPAQueryFactory queryFactory;
    private final JdbcClient jdbcClient;
    private final UserService userService;

    // --- General ---

    public LocalDate findEarliestStatDate() {
        return queryFactory
                .select(dailyCategoryStat.id.statDate.min())
                .from(dailyCategoryStat)
                .fetchOne();
    }

    // --- Type-level totals ---

    public List<TypeAmountResult> sumByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        TypeAmountResult.class,
                        dailyCategoryStat.id.type,
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.id.type)
                .fetch();
    }

    // --- Daily trends ---

    public List<DailyTrendResult> findDailyTrendByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        DailyTrendResult.class,
                        dailyCategoryStat.id.statDate,
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.id.statDate)
                .orderBy(dailyCategoryStat.id.statDate.asc())
                .fetch();
    }

    public List<DailyTrendResult> findCumulativeDailyBalance(StatisticsFilter filter) {
        StringBuilder sql =
                new StringBuilder("SELECT daily.stat_date, SUM(daily.daily_balance) OVER (ORDER BY daily.stat_date)"
                        + " FROM (SELECT stat_date,"
                        + " SUM(CASE WHEN CAST(type AS TEXT) = 'INCOME'"
                        + " THEN total_amount ELSE -total_amount END) AS daily_balance"
                        + " FROM mv_daily_category_stat"
                        + " WHERE user_id = :userId");
        appendDateFilter(sql, filter, "stat_date");
        appendCategoryFilter(sql, filter, "category_id");
        sql.append(" GROUP BY stat_date) daily ORDER BY daily.stat_date");

        JdbcClient.StatementSpec spec = jdbcClient.sql(sql.toString()).param("userId", userService.getCurrentUserId());
        spec = applyDateParams(spec, filter);
        spec = applyCategoryParams(spec, filter);

        return spec.query((rs, rowNum) -> new DailyTrendResult(rs.getDate(1).toLocalDate(), rs.getBigDecimal(2)))
                .list();
    }

    // --- Monthly aggregations ---

    public List<MonthlyBalanceResult> findMonthlyBalance(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        NumberExpression<BigDecimal> balanceExpr = new CaseBuilder()
                .when(dailyCategoryStat.id.type.eq(TransactionType.INCOME))
                .then(dailyCategoryStat.totalAmount)
                .otherwise(dailyCategoryStat.totalAmount.negate());

        return queryFactory
                .select(Projections.constructor(
                        MonthlyBalanceResult.class,
                        dailyCategoryStat.id.statDate.year(),
                        dailyCategoryStat.id.statDate.month(),
                        balanceExpr.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.id.statDate.year(), dailyCategoryStat.id.statDate.month())
                .orderBy(
                        dailyCategoryStat.id.statDate.year().asc(),
                        dailyCategoryStat.id.statDate.month().asc())
                .fetch();
    }

    public List<MonthlyIncomeExpenseResult> findMonthlyIncomeExpense(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        NumberExpression<BigDecimal> incomeExpr = new CaseBuilder()
                .when(dailyCategoryStat.id.type.eq(TransactionType.INCOME))
                .then(dailyCategoryStat.totalAmount)
                .otherwise(BigDecimal.ZERO);
        NumberExpression<BigDecimal> expenseExpr = new CaseBuilder()
                .when(dailyCategoryStat.id.type.ne(TransactionType.INCOME))
                .then(dailyCategoryStat.totalAmount)
                .otherwise(BigDecimal.ZERO);

        return queryFactory
                .select(Projections.constructor(
                        MonthlyIncomeExpenseResult.class,
                        dailyCategoryStat.id.statDate.year(),
                        dailyCategoryStat.id.statDate.month(),
                        incomeExpr.sum().coalesce(BigDecimal.ZERO),
                        expenseExpr.sum().coalesce(BigDecimal.ZERO),
                        dailyCategoryStat.transactionCount.sum().coalesce(0L)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.id.statDate.year(), dailyCategoryStat.id.statDate.month())
                .orderBy(
                        dailyCategoryStat.id.statDate.year().asc(),
                        dailyCategoryStat.id.statDate.month().asc())
                .fetch();
    }

    public List<MonthlyBalanceResult> findMonthlyPeakByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        MonthlyBalanceResult.class,
                        dailyCategoryStat.id.statDate.year(),
                        dailyCategoryStat.id.statDate.month(),
                        dailyCategoryStat.maxAmount.max().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.id.statDate.year(), dailyCategoryStat.id.statDate.month())
                .orderBy(
                        dailyCategoryStat.id.statDate.year().asc(),
                        dailyCategoryStat.id.statDate.month().asc())
                .fetch();
    }

    // --- Category totals ---

    public List<CategoryFlowResult> findCategoryFlow(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        CategoryFlowResult.class,
                        dailyCategoryStat.id.type,
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.id.type, dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor)
                .fetch();
    }

    public List<CategoryFlowResult> findCategoryTotalsGroupedByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        CategoryFlowResult.class,
                        dailyCategoryStat.id.type,
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.id.type, dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor)
                .orderBy(
                        dailyCategoryStat.id.type.asc(),
                        dailyCategoryStat.totalAmount.sum().desc())
                .fetch();
    }

    public List<CategoryAmountResult> findCategoryStatsAmount(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        CategoryAmountResult.class,
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.categoryIcon,
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(
                        dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor, dailyCategoryStat.categoryIcon)
                .orderBy(dailyCategoryStat.categoryName.asc())
                .fetch();
    }

    public List<CategoryAverageResult> findCategoryStatsAverage(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        var totalExpr = dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO);
        var countExpr = dailyCategoryStat.transactionCount.sum().coalesce(0L);

        return queryFactory
                .select(dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor, totalExpr, countExpr)
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor)
                .orderBy(dailyCategoryStat.categoryName.asc())
                .fetch()
                .stream()
                .map(row -> {
                    long count = row.get(countExpr);
                    BigDecimal total = row.get(totalExpr);
                    BigDecimal avg = count > 0
                            ? total.divide(BigDecimal.valueOf(count), AVG_SCALE, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;
                    return new CategoryAverageResult(
                            row.get(dailyCategoryStat.categoryName), row.get(dailyCategoryStat.categoryColor), avg);
                })
                .toList();
    }

    public List<CategoryStatsResult> findCategoryStatsAmountCountAverage(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        var totalExpr = dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO);
        var countExpr = dailyCategoryStat.transactionCount.sum().coalesce(0L);

        return queryFactory
                .select(dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor, totalExpr, countExpr)
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor)
                .orderBy(dailyCategoryStat.categoryName.asc())
                .fetch()
                .stream()
                .map(row -> {
                    long count = row.get(countExpr);
                    BigDecimal total = row.get(totalExpr);
                    BigDecimal avg = count > 0
                            ? total.divide(BigDecimal.valueOf(count), AVG_SCALE, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;
                    return new CategoryStatsResult(
                            row.get(dailyCategoryStat.categoryName),
                            row.get(dailyCategoryStat.categoryColor),
                            total,
                            count,
                            avg);
                })
                .toList();
    }

    // --- Category trends (monthly / yearly) ---

    public List<MonthlyCategoryResult> findMonthlyCategoryTotals(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        MonthlyCategoryResult.class,
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.id.statDate.year(),
                        dailyCategoryStat.id.statDate.month(),
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.id.statDate.year(),
                        dailyCategoryStat.id.statDate.month())
                .orderBy(
                        dailyCategoryStat.id.statDate.year().asc(),
                        dailyCategoryStat.id.statDate.month().asc(),
                        dailyCategoryStat.categoryName.asc())
                .fetch();
    }

    public List<YearlyCategoryResult> findYearlyCategoryTotals(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        YearlyCategoryResult.class,
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.id.statDate.year(),
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.id.statDate.year())
                .orderBy(dailyCategoryStat.id.statDate.year().asc(), dailyCategoryStat.categoryName.asc())
                .fetch();
    }

    // --- Stat card queries ---

    public BigDecimal sumAmountByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        BigDecimal result = queryFactory
                .select(dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO))
                .from(dailyCategoryStat)
                .where(predicate)
                .fetchOne();
        return result != null ? result : BigDecimal.ZERO;
    }

    public Long countTransactionsByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        Long result = queryFactory
                .select(dailyCategoryStat.transactionCount.sum().coalesce(0L))
                .from(dailyCategoryStat)
                .where(predicate)
                .fetchOne();
        return result != null ? result : 0L;
    }

    public CategoryAmountResult findTopCategoryByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildStatPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        CategoryAmountResult.class,
                        dailyCategoryStat.categoryName,
                        dailyCategoryStat.categoryColor,
                        dailyCategoryStat.categoryIcon,
                        dailyCategoryStat.totalAmount.sum().coalesce(BigDecimal.ZERO)))
                .from(dailyCategoryStat)
                .where(predicate)
                .groupBy(
                        dailyCategoryStat.categoryName, dailyCategoryStat.categoryColor, dailyCategoryStat.categoryIcon)
                .orderBy(dailyCategoryStat.totalAmount.sum().desc())
                .limit(1)
                .fetchOne();
    }

    public Long countNoSpendDays(StatisticsFilter filter) {
        String endBound = filter.endDate() != null ? "CAST(:endDate AS date)" : "CAST(NOW() AS date)";

        StringBuilder sql = new StringBuilder("SELECT COUNT(d.day)::bigint"
                + " FROM generate_series(CAST(:startDate AS date), " + endBound + ","
                + " '1 day'::interval) d(day)"
                + " LEFT JOIN mv_daily_category_stat s ON CAST(s.stat_date AS date) = d.day"
                + " AND s.user_id = :userId"
                + " AND CAST(s.type AS TEXT) = 'EXPENSE'");
        appendCategoryFilter(sql, filter, "s.category_id");
        sql.append(" WHERE s.stat_date IS NULL");

        JdbcClient.StatementSpec spec = jdbcClient
                .sql(sql.toString())
                .param("userId", userService.getCurrentUserId())
                .param("startDate", toSqlDate(filter.startDate()));
        if (filter.endDate() != null) {
            spec = spec.param("endDate", toSqlDate(filter.endDate()));
        }
        spec = applyCategoryParams(spec, filter);

        return spec.query((rs, rowNum) -> rs.getLong(1)).single();
    }

    // --- Native queries (heatmap, boxplot) ---

    public List<HeatmapResult> findWeeklyHeatmapExpense(StatisticsFilter filter) {
        StringBuilder sql = new StringBuilder("SELECT EXTRACT(ISODOW FROM stat_date)::int,"
                + " EXTRACT(WEEK FROM stat_date)::int,"
                + " COALESCE(SUM(total_amount), 0)"
                + " FROM mv_daily_category_stat"
                + " WHERE user_id = :userId"
                + " AND CAST(type AS TEXT) = 'EXPENSE'");
        appendDateFilter(sql, filter, "stat_date");
        appendCategoryFilter(sql, filter, "category_id");
        sql.append(" GROUP BY EXTRACT(ISODOW FROM stat_date), EXTRACT(WEEK FROM stat_date)");
        sql.append(" ORDER BY 2, 1");

        JdbcClient.StatementSpec spec = jdbcClient.sql(sql.toString()).param("userId", userService.getCurrentUserId());
        spec = applyDateParams(spec, filter);
        spec = applyCategoryParams(spec, filter);

        return spec.query((rs, rowNum) -> new HeatmapResult(rs.getInt(1), rs.getInt(2), rs.getBigDecimal(3)))
                .list();
    }

    public List<MonthlyBoxplotResult> findBoxplotByMonthExpense(StatisticsFilter filter) {
        StringBuilder sql = new StringBuilder("SELECT sub.yr, sub.mn,"
                + " MIN(sub.daily_total),"
                + " PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY sub.daily_total),"
                + " PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sub.daily_total),"
                + " PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY sub.daily_total),"
                + " MAX(sub.daily_total)"
                + " FROM ("
                + " SELECT EXTRACT(YEAR FROM stat_date)::int AS yr,"
                + " EXTRACT(MONTH FROM stat_date)::int AS mn,"
                + " stat_date,"
                + " SUM(total_amount) AS daily_total"
                + " FROM mv_daily_category_stat"
                + " WHERE user_id = :userId"
                + " AND CAST(type AS TEXT) = 'EXPENSE'");
        appendDateFilter(sql, filter, "stat_date");
        appendCategoryFilter(sql, filter, "category_id");
        sql.append(" GROUP BY stat_date) sub");
        sql.append(" GROUP BY sub.yr, sub.mn");
        sql.append(" ORDER BY sub.yr, sub.mn");

        JdbcClient.StatementSpec spec = jdbcClient.sql(sql.toString()).param("userId", userService.getCurrentUserId());
        spec = applyDateParams(spec, filter);
        spec = applyCategoryParams(spec, filter);

        return spec.query((rs, rowNum) -> new MonthlyBoxplotResult(
                        rs.getInt(1),
                        rs.getInt(2),
                        rs.getBigDecimal(3),
                        rs.getBigDecimal(4),
                        rs.getBigDecimal(5),
                        rs.getBigDecimal(6),
                        rs.getBigDecimal(7)))
                .list();
    }

    // --- Transaction table queries ---

    public List<ScatterResult> findScatterData(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildTransactionPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        ScatterResult.class,
                        transaction.date,
                        transaction.amount,
                        transaction.category.name,
                        transaction.category.color))
                .from(transaction)
                .join(transaction.category)
                .where(predicate)
                .orderBy(transaction.date.asc())
                .fetch();
    }

    public List<CategoryBoxplotResult> findBoxplotByExpenseCategory(StatisticsFilter filter) {
        StringBuilder sql = new StringBuilder("SELECT c.name, c.color,"
                + " MIN(t.amount),"
                + " PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY t.amount),"
                + " PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY t.amount),"
                + " PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY t.amount),"
                + " MAX(t.amount)"
                + " FROM \"transaction\" t"
                + " JOIN category c ON t.category_id = c.id"
                + " WHERE t.user_id = :userId"
                + " AND CAST(t.type AS TEXT) = 'EXPENSE'");
        appendDateFilter(sql, filter, "t.date");
        appendCategoryFilter(sql, filter, "t.category_id");
        sql.append(" GROUP BY c.name, c.color");
        sql.append(" ORDER BY c.name");

        JdbcClient.StatementSpec spec = jdbcClient.sql(sql.toString()).param("userId", userService.getCurrentUserId());
        spec = applyDateParams(spec, filter);
        spec = applyCategoryParams(spec, filter);

        return spec.query((rs, rowNum) -> new CategoryBoxplotResult(
                        rs.getString(1),
                        rs.getString(2),
                        rs.getBigDecimal(3),
                        rs.getBigDecimal(4),
                        rs.getBigDecimal(5),
                        rs.getBigDecimal(6),
                        rs.getBigDecimal(7)))
                .list();
    }

    public TopTransactionResult findTopTransactionByType(StatisticsFilter filter) {
        BooleanBuilder predicate = StatisticsPredicateBuilder.buildTransactionPredicate(filter);
        return queryFactory
                .select(Projections.constructor(
                        TopTransactionResult.class,
                        transaction.amount,
                        transaction.title,
                        transaction.category.color,
                        transaction.category.icon.stringValue()))
                .from(transaction)
                .join(transaction.category)
                .where(predicate)
                .orderBy(transaction.amount.desc())
                .limit(1)
                .fetchOne();
    }

    // --- helpers ---

    private static void appendDateFilter(StringBuilder sql, StatisticsFilter filter, String column) {
        if (filter.startDate() != null) {
            sql.append(" AND ").append(column).append(" >= :startDate");
        }
        if (filter.endDate() != null) {
            sql.append(" AND ").append(column).append(" <= :endDate");
        }
    }

    private static void appendCategoryFilter(StringBuilder sql, StatisticsFilter filter, String column) {
        if (filter.hasCategoryFilter()) {
            sql.append(" AND ").append(column).append(" IN (:categoryIds)");
        }
    }

    private static JdbcClient.StatementSpec applyDateParams(JdbcClient.StatementSpec spec, StatisticsFilter filter) {
        if (filter.startDate() != null) {
            spec = spec.param("startDate", toSqlDate(filter.startDate()));
        }
        if (filter.endDate() != null) {
            spec = spec.param("endDate", toSqlDate(filter.endDate()));
        }
        return spec;
    }

    private static JdbcClient.StatementSpec applyCategoryParams(
            JdbcClient.StatementSpec spec, StatisticsFilter filter) {
        if (filter.hasCategoryFilter()) {
            spec = spec.param("categoryIds", filter.categoryIds());
        }
        return spec;
    }

    private static Date toSqlDate(LocalDate localDate) {
        return localDate != null ? Date.valueOf(localDate) : null;
    }
}
