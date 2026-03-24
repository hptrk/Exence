package com.exence.finance.modules.statistics.repository;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.entity.QDailyCategoryStat;
import com.exence.finance.modules.transaction.entity.QTransaction;
import com.querydsl.core.BooleanBuilder;
import lombok.experimental.UtilityClass;

@UtilityClass
public final class StatisticsPredicateBuilder {

    @SuppressWarnings("checkstyle:ConstantName")
    private static final QDailyCategoryStat dailyCategoryStat = QDailyCategoryStat.dailyCategoryStat;

    @SuppressWarnings("checkstyle:ConstantName")
    private static final QTransaction transaction = QTransaction.transaction;

    public static BooleanBuilder buildStatPredicate(StatisticsFilter filter) {
        BooleanBuilder builder = new BooleanBuilder();

        if (filter.startDate() != null) {
            builder.and(dailyCategoryStat.id.statDate.goe(filter.startDate()));
        }
        if (filter.endDate() != null) {
            builder.and(dailyCategoryStat.id.statDate.loe(filter.endDate()));
        }
        if (filter.type() != null) {
            builder.and(dailyCategoryStat.id.type.eq(filter.type()));
        }
        if (filter.hasCategoryFilter()) {
            builder.and(dailyCategoryStat.id.categoryId.in(filter.categoryIds()));
        }

        return builder;
    }

    public static BooleanBuilder buildTransactionPredicate(StatisticsFilter filter) {
        BooleanBuilder builder = new BooleanBuilder();

        if (filter.startDate() != null) {
            builder.and(transaction.date.goe(filter.startDate()));
        }
        if (filter.endDate() != null) {
            builder.and(transaction.date.loe(filter.endDate()));
        }
        if (filter.type() != null) {
            builder.and(transaction.type.eq(filter.type()));
        }
        if (filter.hasCategoryFilter()) {
            builder.and(transaction.category.id.in(filter.categoryIds()));
        }

        return builder;
    }
}
