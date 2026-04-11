package com.exence.finance.modules.transaction.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;

@Schema(
        title = "Recurring Transaction Get DTO",
        description =
                "Used for retrieving details of a recurring transaction. Contains all relevant fields to display the"
                        + " transaction.")
public record RecurringTransactionGetDTO(
        @Schema(description = "Unique identifier of the recurring transaction.", example = "1") Long id,
        @Schema(description = "Title of the transaction.", example = "Netflix") String title,
        @Schema(
                        description = "Note for the transaction.",
                        example = "Monthly subscription for streaming service. Shared with family.")
                String note,
        @Schema(description = "Amount of the transaction.", example = "4500.00") BigDecimal amount,
        @Schema(description = "Type of the transaction.", example = "EXPENSE") TransactionType type,
        @Schema(description = "ID of the category associated with the transaction.", example = "5") Long categoryId,
        @Schema(description = "Currency of the transaction amount.", example = "HUF") SupportedCurrency currency,
        @Schema(description = "Recurrence frequency of the transaction.", example = "MONTHLY")
                RecurrenceFrequency frequency,
        @Schema(
                        description =
                                "Interval for the recurrence. For example, an interval of 2 with a frequency of MONTHLY means"
                                        + " the transaction occurs every 2 months.",
                        example = "1")
                Integer interval,
        @Schema(
                        description = "Day of the week for weekly recurrences. Required if frequency is WEEKLY.",
                        example = "MONDAY")
                DayOfWeek dayOfWeek,
        @Schema(
                        description = "Day of the month for monthly recurrences. Required if frequency is MONTHLY.",
                        example = "15")
                Integer dayOfMonth,
        @Schema(
                        description =
                                "End condition for the recurrence. For example, if endCondition is UNTIL_DATE, the transaction"
                                        + " will stop occurring after the specified date.",
                        example = "UNTIL_DATE")
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
                Integer maxOccurrences,
        @Schema(
                        description =
                                "Current number of occurrences that have already happened. This field is used to track how"
                                        + " many times the transaction has occurred so far.",
                        example = "3")
                Integer currentOccurrences,
        @Schema(
                        description =
                                "Next execution date for the transaction. This field indicates the next date when the"
                                        + " transaction is scheduled to occur based on the recurrence pattern.",
                        example = "2026-11-15")
                LocalDate nextExecutionDate,
        @Schema(
                        description =
                                "Indicates whether the recurring transaction is currently active. A transaction is considered"
                                        + " active if it has not reached its end condition (e.g., end date or maximum"
                                        + " occurrences).",
                        example = "true")
                Boolean active) {}
