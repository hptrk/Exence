package com.exence.finance.modules.transaction.dto;

import static com.exence.finance.common.util.ValidationConstants.RECURRING_DAY_OF_MONTH_MAX;
import static com.exence.finance.common.util.ValidationConstants.RECURRING_DAY_OF_MONTH_MIN;
import static com.exence.finance.common.util.ValidationConstants.RECURRING_INTERVAL_MIN;
import static com.exence.finance.common.util.ValidationConstants.RECURRING_MAX_OCCURRENCES_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_FRACTION_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_INTEGER_DIGITS;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_AMOUNT_MIN;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_NOTE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.TRANSACTION_TITLE_MIN_LENGTH;

import com.exence.finance.common.annotations.ValidRecurringTransaction;
import com.exence.finance.common.dto.SupportedCurrency;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;

@Schema(
        title = "Recurring Transaction Create DTO",
        description = "Used for creating a new recurring transaction. Contains all necessary fields to define the"
                + " transaction details. Validations ensure that the provided data adheres to business rules for"
                + " transaction creation and recurrence scheduling.")
@ValidRecurringTransaction
public record RecurringTransactionCreateDTO(
        @Schema(description = "Title of the transaction. Must be between 3 and 100 characters.", example = "Netflix")
                @NotBlank(message = "{validation.transaction.title.not-blank}")
                @Size(
                        min = TRANSACTION_TITLE_MIN_LENGTH,
                        max = TRANSACTION_TITLE_MAX_LENGTH,
                        message = "{validation.transaction.title.size}")
                String title,
        @Schema(
                        description = "Optional note for the transaction. Maximum length is 255 characters.",
                        example = "Monthly subscription for streaming service. Shared with family.")
                @Size(max = TRANSACTION_NOTE_MAX_LENGTH, message = "{validation.transaction.note.size}")
                String note,
        @Schema(
                        description =
                                "Amount of the transaction. Must be a positive number with up to 10 integer digits and 2"
                                        + " fraction digits.",
                        example = "4500.00")
                @NotNull(message = "{validation.transaction.amount.not-null}")
                @DecimalMin(value = TRANSACTION_AMOUNT_MIN, message = "{validation.transaction.amount.min}")
                @Digits(
                        integer = TRANSACTION_AMOUNT_INTEGER_DIGITS,
                        fraction = TRANSACTION_AMOUNT_FRACTION_DIGITS,
                        message = "{validation.transaction.amount.digits}")
                BigDecimal amount,
        @Schema(description = "Type of the transaction.", example = "EXPENSE")
                @NotNull(message = "{validation.transaction.type.not-null}")
                TransactionType type,
        @Schema(description = "ID of the category this transaction belongs to.", example = "5")
                @NotNull(message = "{validation.transaction.category.not-null}")
                Long categoryId,
        @Schema(description = "Currency of the transaction amount.", example = "HUF") SupportedCurrency currency,
        @Schema(description = "Recurrence frequency of the transaction.", example = "MONTHLY")
                @NotNull(message = "{validation.recurring.frequency.not-null}")
                RecurrenceFrequency frequency,
        @Schema(
                        description =
                                "Interval of the recurrence. For example, if frequency is MONTHLY and interval is 2, the"
                                        + " transaction will occur every 2 months.",
                        example = "1")
                @NotNull(message = "{validation.recurring.interval.not-null}")
                @Min(value = RECURRING_INTERVAL_MIN, message = "{validation.recurring.interval.min}")
                Integer interval,
        @Schema(
                        description =
                                "Day of the week for weekly recurrences. For example, if frequency is WEEKLY and dayOfWeek is"
                                        + " MONDAY, the transaction will occur every Monday.",
                        example = "MONDAY")
                DayOfWeek dayOfWeek,
        @Schema(
                        description =
                                "Day of the month for monthly recurrences. Must be between 1 and 31 to ensure valid dates. For"
                                        + " example, if frequency is MONTHLY and dayOfMonth is 15, the transaction will occur on"
                                        + " the 15th of every month.",
                        example = "15")
                @Min(value = RECURRING_DAY_OF_MONTH_MIN, message = "{validation.recurring.day-of-month.min}")
                @Max(value = RECURRING_DAY_OF_MONTH_MAX, message = "{validation.recurring.day-of-month.max}")
                Integer dayOfMonth,
        @Schema(
                        description =
                                "End condition for the recurrence. For example, if endCondition is UNTIL_DATE, the transaction"
                                        + " will stop occurring after the specified date.",
                        example = "UNTIL_DATE")
                @NotNull(message = "{validation.recurring.end-condition.not-null}")
                EndCondition endCondition,
        @Schema(
                        description =
                                "End date for the recurrence. Required if endCondition is UNTIL_DATE. For example, if the date"
                                        + " is 2026-12-31, the transaction will stop occurring after December 31, 2026.",
                        example = "2026-12-31")
                LocalDate endDate,
        @Schema(
                        description = "Maximum number of occurrences for the recurrence. Required if endCondition is"
                                + " AFTER_OCCURRENCES. Must be at least 1 to ensure that the transaction occurs at least"
                                + " once.",
                        example = "12")
                @Min(value = RECURRING_MAX_OCCURRENCES_MIN, message = "{validation.recurring.max-occurrences.min}")
                Integer maxOccurrences,
        @Schema(
                        description =
                                "Start date for the recurrence. The transaction will start occurring on this date.",
                        example = "2026-01-01")
                @NotNull(message = "{validation.recurring.start-date.not-null}")
                LocalDate startDate) {}
