package com.exence.finance.modules.transaction.entity;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_PRECISION;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_NOTE_MAX_LENGTH;

import com.exence.finance.common.entity.BaseAuditableEntity;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.category.entity.Category;
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
import java.time.Instant;
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
@Table(name = "transaction")
@Filter(name = "userFilter", condition = "user_id = :userId")
public class Transaction extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_id_seq")
    @SequenceGenerator(name = "transaction_id_seq", sequenceName = "transaction_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "note", length = TRANSACTION_NOTE_MAX_LENGTH)
    private String note;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

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
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @NotNull
    @Column(name = "recurring", nullable = false)
    private Boolean recurring;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
