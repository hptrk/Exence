package com.exence.finance.modules.investment.entity;

import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_ASSET_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.INVESTMENT_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_PRECISION;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.entity.BaseAuditableEntity;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.investment.enums.InvestmentType;
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
        exclude = {"user"})
@ToString(
        callSuper = true,
        exclude = {"user"})
@Table(name = "investment")
@Filter(name = "userFilter", condition = "user_id = :userId")
public class Investment extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "investment_id_seq")
    @SequenceGenerator(name = "investment_id_seq", sequenceName = "investment_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = INVESTMENT_ASSET_MAX_LENGTH)
    @Column(name = "asset", nullable = false, length = INVESTMENT_ASSET_MAX_LENGTH)
    private String asset;

    @NotNull
    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", nullable = false)
    private InvestmentType type;

    @NotNull
    @DecimalMin(value = INVESTMENT_AMOUNT_MIN)
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS, fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    @Column(
            name = "amount",
            nullable = false,
            precision = TRANSACTION_AMOUNT_PRECISION,
            scale = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    private BigDecimal amount;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "currency", nullable = false)
    private SupportedCurrency currency;

    @NotNull
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS, fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    @Column(
            name = "base_currency_amount",
            nullable = false,
            precision = TRANSACTION_AMOUNT_PRECISION,
            scale = TRANSACTION_AMOUNT_FRACTION_DIGITS)
    private BigDecimal baseCurrencyAmount;

    @Size(max = INVESTMENT_NOTE_MAX_LENGTH)
    @Column(name = "note", length = INVESTMENT_NOTE_MAX_LENGTH)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
