package com.exence.finance.modules.statistics.dto;

import com.exence.finance.modules.transaction.dto.TransactionType;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record StatisticsFilter(Instant startDate, Instant endDate, TransactionType type, List<Long> categoryIds) {

    public boolean hasCategoryFilter() {
        return categoryIds != null && !categoryIds.isEmpty();
    }
}
