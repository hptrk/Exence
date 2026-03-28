package com.exence.finance.modules.transaction.dto;

import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MIN_LENGTH;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
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
@EqualsAndHashCode(
        callSuper = false,
        exclude = {})
@ToString(
        callSuper = true,
        exclude = {})
@JsonIdentityInfo(
        generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = TransactionDTO.class)
public class TransactionDTO {
    private Long id;

    @NotBlank(message = "{validation.transaction.title.not-blank}")
    @Size(
            min = TRANSACTION_TITLE_MIN_LENGTH,
            max = TRANSACTION_TITLE_MAX_LENGTH,
            message = "{validation.transaction.title.size}")
    private String title;

    @Size(max = TRANSACTION_NOTE_MAX_LENGTH, message = "{validation.transaction.note.size}")
    private String note;

    @NotNull(message = "{validation.transaction.date.not-null}")
    private Instant date;

    @NotNull(message = "{validation.transaction.amount.not-null}")
    @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.transaction.amount.min}")
    @Digits(
            integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
            fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
            message = "{validation.transaction.amount.digits}")
    private BigDecimal amount;

    @NotNull(message = "{validation.transaction.type.not-null}")
    private TransactionType type;

    private Boolean recurring;

    @NotNull(message = "{validation.transaction.category.not-null}")
    private Long categoryId;
}
