package com.exence.finance.modules.transaction.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.Instant;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MIN_LENGTH;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Data
@EqualsAndHashCode(callSuper = false, exclude = { "" })
@ToString(callSuper = true, exclude = { "" })
@JsonIdentityInfo(generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = TransactionDTO.class)
public class TransactionDTO {
    private Long id;

    @NotBlank(message = "Transaction title cannot be blank")
    @Size(min = TRANSACTION_TITLE_MIN_LENGTH,
            max = TRANSACTION_TITLE_MAX_LENGTH,
            message = "Transaction title must be between " + TRANSACTION_TITLE_MIN_LENGTH + " and " + TRANSACTION_TITLE_MAX_LENGTH + " characters")
    private String title;

    @NotNull(message = "Transaction date is required")
    private Instant date;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "Amount must be greater than " + TRANSACTION_AMOUNT_MIN)
    @Digits(integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
            fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
            message = "Amount must have at most " + TRANSACTION_AMOUNT_INTEGER_DIGITS + " integer digits and " + TRANSACTION_AMOUNT_FRACTION_DIGITS + " decimal places")
    private BigDecimal amount;

    @NotNull(message = "Transaction type is required")
    private TransactionType type;

    private Boolean recurring;

    @NotNull(message = "Category is required")
    private Long categoryId;
}
