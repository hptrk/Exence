package com.exence.finance.modules.debt.entity;

import static com.exence.finance.common.util.ValidationConstants.DEBT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.DEBT_COUNTERPARTY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.DEBT_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_PRECISION;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.entity.BaseAuditableEntity;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
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
        exclude = {"user", "category"})
@ToString(
        callSuper = true,
        exclude = {"user", "category"})
@Table(name = "debt")
@Filter(name = "userFilter", condition = "user_id = :userId")
public class Debt extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "debt_id_seq")
    @SequenceGenerator(name = "debt_id_seq", sequenceName = "debt_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = DEBT_TITLE_MAX_LENGTH)
    @Column(name = "title", nullable = false, length = DEBT_TITLE_MAX_LENGTH)
    private String title;

    @NotNull
    @Size(max = DEBT_COUNTERPARTY_NAME_MAX_LENGTH)
    @Column(name = "counterparty_name", nullable = false, length = DEBT_COUNTERPARTY_NAME_MAX_LENGTH)
    private String counterpartyName;

    @NotNull
    @DecimalMin(value = DEBT_AMOUNT_MIN)
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS, fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    @Column(
            name = "original_amount",
            nullable = false,
            precision = TRANSACTION_AMOUNT_PRECISION,
            scale = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    private BigDecimal originalAmount;

    @NotNull
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS, fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    @Column(
            name = "remaining_amount",
            nullable = false,
            precision = TRANSACTION_AMOUNT_PRECISION,
            scale = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    private BigDecimal remainingAmount;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "currency", nullable = false)
    private SupportedCurrency currency;

    @NotNull
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS, fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    @Column(
            name = "original_base_currency_amount",
            nullable = false,
            precision = TRANSACTION_AMOUNT_PRECISION,
            scale = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    private BigDecimal originalBaseCurrencyAmount;

    @NotNull
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS, fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    @Column(
            name = "remaining_base_currency_amount",
            nullable = false,
            precision = TRANSACTION_AMOUNT_PRECISION,
            scale = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    private BigDecimal remainingBaseCurrencyAmount;

    @Column(name = "deadline")
    private LocalDate deadline;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", nullable = false)
    private DebtType type;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private DebtStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
