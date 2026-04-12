package com.exence.finance.modules.statistics.repository;

import com.exence.finance.modules.auth.entity.QUser;
import com.exence.finance.modules.category.entity.QCategory;
import com.exence.finance.modules.statistics.dto.result.CurrencyCountResult;
import com.exence.finance.modules.statistics.dto.result.DailyCountResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyAvgResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyCountResult;
import com.exence.finance.modules.statistics.dto.result.TopUserResult;
import com.exence.finance.modules.statistics.dto.result.TypeCountResult;
import com.exence.finance.modules.transaction.entity.QTransaction;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.DateExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminStatisticsQueryService {

    private static final QUser user = QUser.user;
    private static final QTransaction transaction = QTransaction.transaction;
    private static final QCategory category = QCategory.category;

    private final JPAQueryFactory queryFactory;

    // --- Active Users ---

    public List<DailyCountResult> findDailyActiveUsers(LocalDate start, LocalDate end) {
        // currently a user is considered active if a transaction was created that day
        DateExpression<Date> activityDate =
                Expressions.dateTemplate(Date.class, "CAST({0} AS date)", transaction.createdAt);

        return queryFactory
                .select(Projections.constructor(
                        DailyCountResult.class, activityDate, transaction.createdBy.countDistinct()))
                .from(transaction)
                .where(transaction
                        .createdAt
                        .isNotNull()
                        .and(activityDate.goe(Date.valueOf(start)))
                        .and(activityDate.loe(Date.valueOf(end))))
                .groupBy(activityDate)
                .orderBy(activityDate.asc())
                .fetch();
    }

    public List<MonthlyCountResult> findMonthlyActiveUsers(LocalDate start, LocalDate end) {
        // currently a user is considered active if a transaction was created that month
        DateExpression<Date> activityDate =
                Expressions.dateTemplate(Date.class, "CAST({0} AS date)", transaction.createdAt);

        return queryFactory
                .select(Projections.constructor(
                        MonthlyCountResult.class,
                        transaction.createdAt.year(),
                        transaction.createdAt.month(),
                        transaction.createdBy.countDistinct()))
                .from(transaction)
                .where(transaction
                        .createdAt
                        .isNotNull()
                        .and(activityDate.goe(Date.valueOf(start)))
                        .and(activityDate.loe(Date.valueOf(end))))
                .groupBy(transaction.createdAt.year(), transaction.createdAt.month())
                .orderBy(
                        transaction.createdAt.year().asc(),
                        transaction.createdAt.month().asc())
                .fetch();
    }

    // --- Transaction Velocity ---

    public List<DailyCountResult> findDailyTransactionCount(LocalDate start, LocalDate end) {
        DateExpression<Date> txDate = Expressions.dateTemplate(Date.class, "CAST({0} AS date)", transaction.createdAt);

        return queryFactory
                .select(Projections.constructor(DailyCountResult.class, txDate, transaction.count()))
                .from(transaction)
                .where(txDate.goe(Date.valueOf(start)).and(txDate.loe(Date.valueOf(end))))
                .groupBy(txDate)
                .orderBy(txDate.asc())
                .fetch();
    }

    // --- Database Growth ---

    public long countTotalUsers() {
        Long count = queryFactory.select(user.count()).from(user).fetchOne();
        return count != null ? count : 0L;
    }

    public long countTotalTransactions() {
        Long count = queryFactory.select(transaction.count()).from(transaction).fetchOne();
        return count != null ? count : 0L;
    }

    public long countTotalCategories() {
        Long count = queryFactory.select(category.count()).from(category).fetchOne();
        return count != null ? count : 0L;
    }

    // --- Currency Distribution ---

    public List<CurrencyCountResult> findCurrencyDistribution(LocalDate start, LocalDate end) {
        return queryFactory
                .select(Projections.constructor(CurrencyCountResult.class, transaction.currency, transaction.count()))
                .from(transaction)
                .where(transaction.date.goe(start).and(transaction.date.loe(end)))
                .groupBy(transaction.currency)
                .orderBy(transaction.count().desc())
                .fetch();
    }

    // --- Avg Transactions Per User ---

    public List<MonthlyAvgResult> findAvgTransactionsPerUserByMonth(LocalDate start, LocalDate end) {
        Long totalUserCount = queryFactory.select(user.count()).from(user).fetchOne();

        if (totalUserCount == null || totalUserCount == 0) {
            return Collections.emptyList();
        }

        List<Tuple> monthlyTxCounts = queryFactory
                .select(transaction.date.year(), transaction.date.month(), transaction.id.count())
                .from(transaction)
                .where(transaction.date.goe(start).and(transaction.date.loe(end)))
                .groupBy(transaction.date.year(), transaction.date.month())
                .orderBy(transaction.date.year().asc(), transaction.date.month().asc())
                .fetch();

        return monthlyTxCounts.stream()
                .map(tuple -> {
                    Integer year = tuple.get(transaction.date.year());
                    Integer month = tuple.get(transaction.date.month());
                    Long txCount = tuple.get(transaction.id.count());

                    int safeYear = year != null ? year : 0;
                    int safeMonth = month != null ? month : 0;
                    double safeTxCount = txCount != null ? txCount : 0;

                    Double avgTx = safeTxCount / totalUserCount;

                    return new MonthlyAvgResult(safeYear, safeMonth, avgTx);
                })
                .toList();
    }

    // --- Transaction Type Distribution ---

    public List<TypeCountResult> findTransactionTypeDistribution(LocalDate start, LocalDate end) {
        return queryFactory
                .select(Projections.constructor(TypeCountResult.class, transaction.type, transaction.count()))
                .from(transaction)
                .where(transaction.date.goe(start).and(transaction.date.loe(end)))
                .groupBy(transaction.type)
                .orderBy(transaction.count().desc())
                .fetch();
    }

    // --- Top Active Users ---

    public List<TopUserResult> findTopActiveUsers(LocalDate start, LocalDate end, int limit) {
        return queryFactory
                .select(Projections.constructor(TopUserResult.class, transaction.createdBy, transaction.count()))
                .from(transaction)
                .where(transaction.date.goe(start).and(transaction.date.loe(end)))
                .groupBy(transaction.createdBy)
                .orderBy(transaction.count().desc())
                .limit(limit)
                .fetch();
    }

    // --- Email Verification Rate ---

    public long countVerifiedUsers() {
        Long count = queryFactory
                .select(user.count())
                .from(user)
                .where(user.emailVerified.isTrue())
                .fetchOne();
        return count != null ? count : 0L;
    }
}
