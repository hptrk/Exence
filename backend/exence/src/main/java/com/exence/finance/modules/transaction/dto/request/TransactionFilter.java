package com.exence.finance.modules.transaction.dto.request;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;

import com.exence.finance.common.annotations.ValidAmountRange;
import com.exence.finance.common.annotations.ValidDateRange;
import com.exence.finance.modules.transaction.dto.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.stream.Stream;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
@ValidDateRange(from = "dateFrom", to = "dateTo")
@ValidAmountRange(from = "amountFrom", to = "amountTo")
public class TransactionFilter implements Serializable {
    @Size(max = TRANSACTION_TITLE_MAX_LENGTH, message = "{validation.filter.keyword.size}")
    private String keyword;

    private Instant dateFrom;

    private Instant dateTo;

    private Long categoryId;

    private TransactionType type;

    @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.filter.amount.min}")
    @Digits(
            integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
            fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
            message = "{validation.transaction.amount.digits}")
    private BigDecimal amountFrom;

    @Digits(
            integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
            fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
            message = "{validation.transaction.amount.digits}")
    private BigDecimal amountTo;

    private Boolean recurring;

    public boolean hasActiveFilter() {
        return Stream.of(keyword, dateFrom, dateTo, categoryId, type, amountFrom, amountTo, recurring)
                .anyMatch(Objects::nonNull);
    }
}
