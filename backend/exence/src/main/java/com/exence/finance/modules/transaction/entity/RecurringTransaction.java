package com.exence.finance.modules.transaction.entity;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_PRECISION;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_NOTE_MAX_LENGTH;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.entity.BaseWorkspaceEntity;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@EqualsAndHashCode(
        callSuper = false,
        exclude = {"category"})
@ToString(
        callSuper = true,
        exclude = {"category"})
@Table(name = "recurring_transaction")
@Filter(name = "workspaceFilter", condition = "workspace_id = :workspaceId")
public class RecurringTransaction extends BaseWorkspaceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "recurring_transaction_id_seq")
    @SequenceGenerator(
            name = "recurring_transaction_id_seq",
            sequenceName = "recurring_transaction_id_seq",
            allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "note", length = TRANSACTION_NOTE_MAX_LENGTH)
    private String note;

    @NotNull
    @DecimalMin(value = TRANSACTION_AMOUNT_MIN)
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS, fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    @Column(
            name = "amount",
            nullable = false,
            precision = TRANSACTION_AMOUNT_PRECISION,
            scale = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    private BigDecimal amount;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "currency", nullable = false)
    private SupportedCurrency currency;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "frequency", nullable = false)
    private RecurrenceFrequency frequency;

    @NotNull
    @Column(name = "interval_value", nullable = false)
    private Integer interval;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "day_of_week")
    private DayOfWeek dayOfWeek;

    @Column(name = "day_of_month")
    private Integer dayOfMonth;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "end_condition", nullable = false)
    private EndCondition endCondition;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "max_occurrences")
    private Integer maxOccurrences;

    @NotNull
    @Column(name = "current_occurrences", nullable = false)
    private Integer currentOccurrences;

    @NotNull
    @Column(name = "next_execution_date", nullable = false)
    private LocalDate nextExecutionDate;

    @NotNull
    @Column(name = "active", nullable = false)
    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
