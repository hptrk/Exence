package com.exence.finance.validators;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.exence.finance.common.annotations.ValidRange;
import com.exence.finance.common.validators.RangeValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class RangeValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        lenient()
                .when(context.buildConstraintViolationWithTemplate(anyString()))
                .thenReturn(builder);
        lenient().when(builder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        lenient().when(nodeBuilder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();
    }

    private RangeValidator createValidator(String from, String to, String message) {
        ValidRange annotation = mock(ValidRange.class);
        when(annotation.from()).thenReturn(from);
        when(annotation.to()).thenReturn(to);
        when(annotation.message()).thenReturn(message);

        RangeValidator validator = new RangeValidator();
        validator.initialize(annotation);
        return validator;
    }

    @Nested
    class DateRangeTests {
        private RangeValidator validator;

        @BeforeEach
        void setUp() {
            validator = createValidator("dateFrom", "dateTo", "{validation.date-range.invalid}");
        }

        @Test
        void test_validDateRange() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.now().minusDays(7);
            testObj.dateTo = LocalDate.now();

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_equalDates() {
            LocalDate today = LocalDate.now();
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = today;
            testObj.dateTo = today;

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_invalidDateRange() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.now();
            testObj.dateTo = LocalDate.now().minusDays(7);

            assertFalse(validator.isValid(testObj, context));
        }

        @Test
        void test_bothDatesNull() {
            DateTestObject testObj = new DateTestObject();
            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_oneDateNull() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.now();
            testObj.dateTo = null;

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_fromDateNull() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = null;
            testObj.dateTo = LocalDate.now();

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_consecutiveDates() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.of(2025, 1, 1);
            testObj.dateTo = LocalDate.of(2025, 1, 2);

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_reversedConsecutiveDates() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.of(2025, 1, 2);
            testObj.dateTo = LocalDate.of(2025, 1, 1);

            assertFalse(validator.isValid(testObj, context));
        }

        @Test
        void test_largeDateRanges() {
            DateTestObject testObj = new DateTestObject();
            testObj.dateFrom = LocalDate.of(2020, 1, 1);
            testObj.dateTo = LocalDate.of(2025, 12, 31);

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_customFieldNames() {
            RangeValidator customValidator = createValidator("startDate", "endDate", "{validation.date-range.invalid}");

            CustomDateTestObject testObj = new CustomDateTestObject();
            testObj.startDate = LocalDate.now().minusDays(1);
            testObj.endDate = LocalDate.now();

            assertTrue(customValidator.isValid(testObj, context));
        }
    }

    @Nested
    class AmountRangeTests {
        private RangeValidator validator;

        @BeforeEach
        void setUp() {
            validator = createValidator("amountFrom", "amountTo", "{validation.amount-range.invalid}");
        }

        @Test
        void test_validAmountRange() {
            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("10.00");
            testObj.amountTo = new BigDecimal("100.00");

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_equalAmounts() {
            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("50.00");
            testObj.amountTo = new BigDecimal("50.00");

            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_invalidAmountRange() {
            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("100.00");
            testObj.amountTo = new BigDecimal("10.00");

            assertFalse(validator.isValid(testObj, context));
        }

        @Test
        void test_bothAmountsNull() {
            AmountTestObject testObj = new AmountTestObject();
            assertTrue(validator.isValid(testObj, context));
        }

        @Test
        void test_oneAmountNull() {
            AmountTestObject testObj = new AmountTestObject();
            testObj.amountFrom = new BigDecimal("10.00");
            testObj.amountTo = null;

            assertTrue(validator.isValid(testObj, context));
        }
    }

    @Nested
    class CommonTests {
        private RangeValidator validator;

        @BeforeEach
        void setUp() {
            validator = createValidator("from", "to", "{validation.range.invalid}");
        }

        @Test
        void test_nullObject() {
            assertTrue(validator.isValid(null, context));
        }

        @Test
        void test_missingFields() {
            Object emptyObj = new Object();
            assertTrue(validator.isValid(emptyObj, context));
        }

        @Test
        void test_nonComparableFields() {
            NonComparableTestObject testObj = new NonComparableTestObject();
            testObj.from = new Object();
            testObj.to = new Object();

            assertTrue(validator.isValid(testObj, context));
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
