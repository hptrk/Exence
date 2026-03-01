package com.exence.finance.modules.statistics.entity;

import com.exence.finance.modules.transaction.dto.TransactionType;
import java.io.Serializable;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

// composite key class for DailyCategoryStat entity
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DailyCategoryStatId implements Serializable {
    private Long userId;
    private Instant statDate;
    private Long categoryId;
    private TransactionType type;
}
