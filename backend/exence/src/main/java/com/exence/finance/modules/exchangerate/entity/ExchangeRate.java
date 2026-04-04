package com.exence.finance.modules.exchangerate.entity;

import static com.exence.finance.common.util.ValidationConstants.EXCHANGE_RATE_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.EXCHANGE_RATE_PRECISION;

import com.exence.finance.common.dto.SupportedCurrency;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@SuperBuilder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exchange_rate", uniqueConstraints = @UniqueConstraint(columnNames = {"rate_date", "currency"}))
public class ExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "exchange_rate_id_seq")
    @SequenceGenerator(name = "exchange_rate_id_seq", sequenceName = "exchange_rate_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "rate_date", nullable = false)
    private LocalDate rateDate;

    @NotNull
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "currency", nullable = false)
    private SupportedCurrency currency;

    @NotNull
    @Column(
            name = "rate_from_eur",
            nullable = false,
            precision = EXCHANGE_RATE_PRECISION,
            scale = EXCHANGE_RATE_FRACTION_DIGITS)
    private BigDecimal rateFromEur;
}
