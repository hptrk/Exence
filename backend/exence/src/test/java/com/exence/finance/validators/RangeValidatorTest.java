package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.exence.finance.common.annotations.ValidRange;
import com.exence.finance.common.validators.RangeValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
public class RangeValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    private RangeValidator createValidator(String from, String to, String message) {
        ValidRange annotation = mock(ValidRange.class);
        when(annotation.from()).thenReturn(from);
        when(annotation.to()).thenReturn(to);
        when(annotation.message()).thenReturn(message);

        RangeValidator validator = new RangeValidator();
        validator.initialize(annotation);
        return validator;
    }

    private void givenViolationContextConfigured() {
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);
        given(builder.addPropertyNode(anyString())).willReturn(nodeBuilder);
    }

    @Nested
    @DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
    class DateRangeTests {
        private RangeValidator validator;

        @BeforeEach
        void setUp() {
            validator = createValidator("dateFrom", "dateTo", "{validation.date-range.invalid}");
        }

        @Test
        void validate_validDateRange() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.now().minusDays(7);
            testObj.dateTo = LocalDate.now();

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_equalDates() {
            LocalDate today = LocalDate.now();
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = today;
            testObj.dateTo = today;

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_invalidDateRange() {
            givenViolationContextConfigured();

            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.now();
            testObj.dateTo = LocalDate.now().minusDays(7);

            assertThat(validator.isValid(testObj, context)).isFalse();
        }

        @Test
        void validate_bothDatesNull() {
            DateTestObject testObj = new DateTestObject();
            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_oneDateNull() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.now();
            testObj.dateTo = null;

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_fromDateNull() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = null;
            testObj.dateTo = LocalDate.now();

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_consecutiveDates() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.of(2025, 1, 1);
            testObj.dateTo = LocalDate.of(2025, 1, 2);

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_reversedConsecutiveDates() {
            givenViolationContextConfigured();

            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.of(2025, 1, 2);
            testObj.dateTo = LocalDate.of(2025, 1, 1);

            assertThat(validator.isValid(testObj, context)).isFalse();
        }

        @Test
        void validate_largeDateRanges() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.of(2020, 1, 1);
            testObj.dateTo = LocalDate.of(2025, 12, 31);

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_customFieldNames() {
            RangeValidator customValidator = createValidator("startDate", "endDate", "{validation.date-range.invalid}");

            CustomDateTestObject testObj = new CustomDateTestObject();
            testObj.startDate = LocalDate.now().minusDays(1);
            testObj.endDate = LocalDate.now();

            assertThat(customValidator.isValid(testObj, context)).isTrue();
        }
    }

    @Nested
    @DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
    class AmountRangeTests {
        private RangeValidator validator;

        @BeforeEach
        void setUp() {
            validator = createValidator("amountFrom", "amountTo", "{validation.amount-range.invalid}");
        }

        @Test
        void validate_validAmountRange() {
            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("10.00");
            testObj.amountTo = new BigDecimal("100.00");

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_equalAmounts() {
            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("50.00");
            testObj.amountTo = new BigDecimal("50.00");

            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_invalidAmountRange() {
            givenViolationContextConfigured();

            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("100.00");
            testObj.amountTo = new BigDecimal("10.00");

            assertThat(validator.isValid(testObj, context)).isFalse();
        }

        @Test
        void validate_bothAmountsNull() {
            AmountTestObject testObj = new AmountTestObject();
            assertThat(validator.isValid(testObj, context)).isTrue();
        }

        @Test
        void validate_oneAmountNull() {
            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("10.00");
            testObj.amountTo = null;

            assertThat(validator.isValid(testObj, context)).isTrue();
        }
    }

    @Nested
    @DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
    class CommonTests {
        private RangeValidator validator;

        @BeforeEach
        void setUp() {
            validator = createValidator("from", "to", "{validation.range.invalid}");
        }

        @Test
        void validate_nullObject() {
            assertThat(validator.isValid(null, context)).isTrue();
        }

        @Test
        void validate_missingFields() {
            Object emptyObj = new Object();
            assertThat(validator.isValid(emptyObj, context)).isTrue();
        }

        @Test
        void validate_nonComparableFields() {
            NonComparableTestObject testObj = new NonComparableTestObject();
            testObj.from = new Object();
            testObj.to = new Object();

            assertThat(validator.isValid(testObj, context)).isTrue();
        }
    }

    @Data
    static class DateTestObject {
        private LocalDate dateFrom;
        private LocalDate dateTo;
    }

    @Data
    static class CustomDateTestObject {
        private LocalDate startDate;
        private LocalDate endDate;
    }

    @Data
    static class AmountTestObject {
        private BigDecimal amountFrom;
        private BigDecimal amountTo;
    }

    @Data
    static class NonComparableTestObject {
        private Object from;
        private Object to;
    }
}
