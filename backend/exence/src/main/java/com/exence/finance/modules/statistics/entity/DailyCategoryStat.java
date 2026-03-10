package com.exence.finance.modules.statistics.entity;

import com.exence.finance.modules.transaction.dto.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Immutable
@Table(name = "mv_daily_category_stat")
@Filter(name = "userFilter", condition = "user_id = :userId")
@IdClass(DailyCategoryStatId.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DailyCategoryStat {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Id
    @Column(name = "stat_date", nullable = false)
    private Instant statDate;

    @Id
    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Id
    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", nullable = false)
    private TransactionType type;

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
