package com.exence.finance.modules.statistics.entity;

import com.exence.finance.modules.transaction.dto.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyCategoryStatId implements Serializable {

    @Column(name = "workspace_id", nullable = false)
    private Long workspaceId;

    @Column(name = "stat_date", nullable = false)
    private LocalDate statDate;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", nullable = false)
    private TransactionType type;
}
