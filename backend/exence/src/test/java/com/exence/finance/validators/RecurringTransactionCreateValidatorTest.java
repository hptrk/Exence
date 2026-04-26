package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.validators.RecurringTransactionCreateValidator;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.ConstraintValidatorContext.ConstraintViolationBuilder;
import jakarta.validation.ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RecurringTransactionCreateValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintViolationBuilder builder;

    @Mock
    private NodeBuilderCustomizableContext nodeBuilder;

    private RecurringTransactionCreateValidator validator;

    @BeforeEach
    void setUp() {
        validator = new RecurringTransactionCreateValidator();
    }

    private void givenViolationContextConfigured() {
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);
        given(builder.addPropertyNode(anyString())).willReturn(nodeBuilder);
    }

    @Test
    @DisplayName("passes when weekly with matching day of week on start date")
    void validate_weeklyValid() {
        // given
        RecurringTransactionCreateDTO dto = dto(
                RecurrenceFrequency.WEEKLY,
                DayOfWeek.MONDAY,
                null,
                EndCondition.NEVER,
                null,
                null,
                LocalDate.of(2025, 1, 6));

        // when
        boolean result = validator.isValid(dto, context);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("fails when weekly recurrence has no day of week")
    void validate_weeklyMissingDayOfWeek() {
        givenViolationContextConfigured();
        // given
        RecurringTransactionCreateDTO dto =
                dto(RecurrenceFrequency.WEEKLY, null, null, EndCondition.NEVER, null, null, LocalDate.of(2025, 1, 6));

        // when
        boolean result = validator.isValid(dto, context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("fails when weekly start date does not match day of week")
    void validate_weeklyStartDateMismatch() {
        givenViolationContextConfigured();
        // given
        RecurringTransactionCreateDTO dto = dto(
                RecurrenceFrequency.WEEKLY,
                DayOfWeek.FRIDAY,
                null,
                EndCondition.NEVER,
                null,
                null,
                LocalDate.of(2025, 1, 6)); // Monday

        // when
        boolean result = validator.isValid(dto, context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("fails when monthly recurrence has no day of month")
    void validate_monthlyMissingDayOfMonth() {
        givenViolationContextConfigured();
        // given
        RecurringTransactionCreateDTO dto =
                dto(RecurrenceFrequency.MONTHLY, null, null, EndCondition.NEVER, null, null, LocalDate.of(2025, 1, 15));

        // when
        boolean result = validator.isValid(dto, context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("fails when UNTIL_DATE has no end date")
    void validate_untilDateMissingEndDate() {
        givenViolationContextConfigured();
        // given
        RecurringTransactionCreateDTO dto = dto(
                RecurrenceFrequency.MONTHLY, null, 15, EndCondition.UNTIL_DATE, null, null, LocalDate.of(2025, 1, 15));

        // when
        boolean result = validator.isValid(dto, context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("fails when end date is not after start date")
    void validate_endDateBeforeStart() {
        givenViolationContextConfigured();
        // given
        RecurringTransactionCreateDTO dto = dto(
                RecurrenceFrequency.MONTHLY,
                null,
                15,
                EndCondition.UNTIL_DATE,
                LocalDate.of(2025, 1, 15),
                null,
                LocalDate.of(2025, 1, 15));

        // when
        boolean result = validator.isValid(dto, context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("fails when AFTER_OCCURRENCES has no max occurrences")
    void validate_afterOccurrencesMissingMax() {
        givenViolationContextConfigured();
        // given
        RecurringTransactionCreateDTO dto = dto(
                RecurrenceFrequency.MONTHLY,
                null,
                15,
                EndCondition.AFTER_OCCURRENCES,
                null,
                null,
                LocalDate.of(2025, 1, 15));

        // when
        boolean result = validator.isValid(dto, context);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("returns true for null input")
    void validate_null() {
        assertThat(validator.isValid(null, context)).isTrue();
    }

    private RecurringTransactionCreateDTO dto(
            RecurrenceFrequency frequency,
            DayOfWeek dayOfWeek,
            Integer dayOfMonth,
            EndCondition endCondition,
            LocalDate endDate,
            Integer maxOccurrences,
            LocalDate startDate) {
        return new RecurringTransactionCreateDTO(
                "Test",
                null,
                new BigDecimal("100.00"),
                TransactionType.EXPENSE,
                1L,
                null,
                frequency,
                1,
                dayOfWeek,
                dayOfMonth,
                endCondition,
                endDate,
                maxOccurrences,
                startDate);
    }
}
