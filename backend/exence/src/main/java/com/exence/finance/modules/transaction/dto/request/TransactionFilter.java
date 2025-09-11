package com.exence.finance.modules.transaction.dto.request;

import com.exence.finance.common.annotations.ValidAmountRange;
import com.exence.finance.common.annotations.ValidDateRange;
import com.exence.finance.modules.transaction.dto.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
@ValidDateRange(from = "dateFrom", to = "dateTo", message = "Date from cannot be after date to")
@ValidAmountRange(from = "amountFrom", to = "amountTo", message = "Amount from cannot be greater than amount to")
public class TransactionFilter implements Serializable {
    @Size(max = TRANSACTION_TITLE_MAX_LENGTH,
            message = "Keyword must be at most " + TRANSACTION_TITLE_MAX_LENGTH + " characters")
    private String keyword;

    private Instant dateFrom;

    private Instant dateTo;

    private Long categoryId;

    private TransactionType type;

    @DecimalMin(value = TRANSACTION_AMOUNT_MIN,
            message = "Minimum amount must be greater than " + TRANSACTION_AMOUNT_MIN)
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
            fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
            message = "Amount must have at most " + TRANSACTION_AMOUNT_INTEGER_DIGITS + " integer digits and " + TRANSACTION_AMOUNT_FRACTION_DIGITS + " decimal places")
    private BigDecimal amountFrom;

    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
            fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
            message = "Amount must have at most " + TRANSACTION_AMOUNT_INTEGER_DIGITS + " integer digits and " + TRANSACTION_AMOUNT_FRACTION_DIGITS + " decimal places")
    private BigDecimal amountTo;

    private Boolean recurring;
}
