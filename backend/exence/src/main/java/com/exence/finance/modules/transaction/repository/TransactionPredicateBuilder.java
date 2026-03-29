package com.exence.finance.modules.transaction.repository;

import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.dto.request.TransactionFilter;
import com.exence.finance.modules.transaction.entity.QTransaction;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.experimental.UtilityClass;
import org.springframework.util.StringUtils;

@UtilityClass
public final class TransactionPredicateBuilder {

    @SuppressWarnings("checkstyle:ConstantName")
    private static final QTransaction qTransaction = QTransaction.transaction;

    public static Predicate buildPredicate(TransactionFilter filter) {
        if (filter == null) {
            return null;
        }

        BooleanBuilder builder = new BooleanBuilder();

        addKeywordFilter(builder, filter.getKeyword());
        addCategoryFilter(builder, filter.getCategoryId());
        addTypeFilter(builder, filter.getType());
        addDateRangeFilter(builder, filter.getDateFrom(), filter.getDateTo());
        addAmountRangeFilter(builder, filter.getAmountFrom(), filter.getAmountTo());
        addRecurringFilter(builder, filter.getRecurring());

        return builder.hasValue() ? builder : null;
    }

    private static void addKeywordFilter(BooleanBuilder builder, String keyword) {
        if (StringUtils.hasText(keyword)) {
            String lowerKeyword = keyword.toLowerCase();
            builder.and(qTransaction
                    .title
                    .lower()
                    .contains(lowerKeyword)
                    .or(qTransaction.note.lower().contains(lowerKeyword)));
        }
    }

    private static void addCategoryFilter(BooleanBuilder builder, Long categoryId) {
        if (categoryId != null) {
            builder.and(qTransaction.category.id.eq(categoryId));
        }
    }

    private static void addTypeFilter(BooleanBuilder builder, TransactionType type) {
        if (type != null) {
            builder.and(qTransaction.type.eq(type));
        }
    }

    private static void addDateRangeFilter(BooleanBuilder builder, LocalDate dateFrom, LocalDate dateTo) {
        if (dateFrom != null) {
            builder.and(qTransaction.date.goe(dateFrom));
        }
        if (dateTo != null) {
            builder.and(qTransaction.date.loe(dateTo));
        }
    }

    private static void addAmountRangeFilter(BooleanBuilder builder, BigDecimal amountFrom, BigDecimal amountTo) {
        if (amountFrom != null) {
            builder.and(qTransaction.amount.goe(amountFrom));
        }
        if (amountTo != null) {
            builder.and(qTransaction.amount.loe(amountTo));
        }
    }

    private static void addRecurringFilter(BooleanBuilder builder, Boolean recurring) {
        if (recurring != null) {
            builder.and(qTransaction.recurring.eq(recurring));
        }
    }
}
