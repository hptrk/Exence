package com.exence.finance.validators;

import com.exence.finance.common.validators.DateRangeValidator;
import com.exence.finance.common.annotations.ValidDateRange;
import jakarta.validation.ConstraintValidatorContext;
import lombok.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class DateRangeValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    private DateRangeValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new DateRangeValidator();

        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        lenient().when(nodeBuilder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();

        ValidDateRange annotation = mock(ValidDateRange.class);
        when(annotation.from()).thenReturn("dateFrom");
        when(annotation.to()).thenReturn("dateTo");
        validator.initialize(annotation);
    }

    @Test
    void test_validDateRange() {
        TestObject testObj = new TestObject();
        testObj.dateFrom = Instant.now().minus(7, ChronoUnit.DAYS);
        testObj.dateTo = Instant.now();

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_equalDates() {
        Instant now = Instant.now();
        TestObject testObj = new TestObject();
        testObj.dateFrom = now;
        testObj.dateTo = now;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_invalidDateRange() {
        TestObject testObj = new TestObject();
        testObj.dateFrom = Instant.now();
        testObj.dateTo = Instant.now().minus(7, ChronoUnit.DAYS);

        assertFalse(validator.isValid(testObj, context));
    }

    @Test
    void test_nullObject() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    void test_bothDatesNull() {
        TestObject testObj = new TestObject();
        testObj.dateFrom = null;
        testObj.dateTo = null;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_oneDateNull() {
        TestObject testObj = new TestObject();
        testObj.dateFrom = Instant.now();
        testObj.dateTo = null;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_fromDateNull() {
        TestObject testObj = new TestObject();
        testObj.dateFrom = null;
        testObj.dateTo = Instant.now();

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_preciseDateComparison() {
        Instant baseTime = Instant.parse("2025-01-01T12:00:00Z");

        TestObject testObj = new TestObject();
        testObj.dateFrom = baseTime;
        testObj.dateTo = baseTime.plus(1, ChronoUnit.SECONDS);

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_veryCloseInvalidDates() {
        Instant baseTime = Instant.parse("2025-01-01T12:00:00Z");

        TestObject testObj = new TestObject();
        testObj.dateFrom = baseTime.plus(1, ChronoUnit.SECONDS);
        testObj.dateTo = baseTime;

        assertFalse(validator.isValid(testObj, context));
    }

    @Test
    void test_largeDateRanges() {
        TestObject testObj = new TestObject();
        testObj.dateFrom = Instant.parse("2020-01-01T00:00:00Z");
        testObj.dateTo = Instant.parse("2025-12-31T23:59:59Z");

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_sameDateDifferentTime() {
        Instant morning = Instant.parse("2025-01-01T08:00:00Z");
        Instant evening = Instant.parse("2025-01-01T20:00:00Z");

        TestObject testObj = new TestObject();
        testObj.dateFrom = morning;
        testObj.dateTo = evening;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_customFieldNames() {
        // test with different field names
        ValidDateRange customAnnotation = mock(ValidDateRange.class);
        when(customAnnotation.from()).thenReturn("startDate");
        when(customAnnotation.to()).thenReturn("endDate");

        DateRangeValidator customValidator = new DateRangeValidator();
        customValidator.initialize(customAnnotation);

        TestObjectWithCustomFields testObj = new TestObjectWithCustomFields();
        testObj.startDate = Instant.now().minus(1, ChronoUnit.DAYS);
        testObj.endDate = Instant.now();

        assertTrue(customValidator.isValid(testObj, context));
    }

    @Test
    void test_nonInstantFields() {
        // if fields are not Instant type, validator should let other validators handle them
        TestObjectWithNonInstantFields testObj = new TestObjectWithNonInstantFields();
        testObj.dateFrom = "2025-01-01";
        testObj.dateTo = "2025-01-02";

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_missingFields() {
        // if fields don't exist, validator should handle it
        Object emptyObj = new Object();

        assertTrue(validator.isValid(emptyObj, context));
    }

    @Data
    static class TestObject {
        private Instant dateFrom;
        private Instant dateTo;
    }

    @Data
    static class TestObjectWithCustomFields {
        private Instant startDate;
        private Instant endDate;
    }

    @Data
    static class TestObjectWithNonInstantFields {
        private String dateFrom;
        private String dateTo;
    }
}