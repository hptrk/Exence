package com.exence.finance.modules.statistics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "mv_daily_category_stat")
@Filter(name = "workspaceFilter", condition = "workspace_id = :workspaceId")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyCategoryStat {

    @EmbeddedId
    private DailyCategoryStatId id;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "category_color", nullable = false)
    private String categoryColor;

    @Column(name = "category_icon", nullable = false)
    private String categoryIcon;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "transaction_count", nullable = false)
    private Long transactionCount;

    @Column(name = "max_amount", nullable = false)
    private BigDecimal maxAmount;
}
