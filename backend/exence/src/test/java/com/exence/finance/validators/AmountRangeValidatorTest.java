package com.exence.finance.validators;

import com.exence.finance.common.validators.AmountRangeValidator;
import com.exence.finance.common.annotations.ValidAmountRange;
import jakarta.validation.ConstraintValidatorContext;
import lombok.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AmountRangeValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    private AmountRangeValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new AmountRangeValidator();

        lenient().when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(builder);
        lenient().when(builder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        lenient().when(nodeBuilder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();

        ValidAmountRange annotation = mock(ValidAmountRange.class);
        when(annotation.from()).thenReturn("amountFrom");
        when(annotation.to()).thenReturn("amountTo");
        validator.initialize(annotation);
    }

    @Test
    void test_validAmountRange() {
        TestObject testObj = new TestObject();
        testObj.amountFrom = new BigDecimal("10.00");
        testObj.amountTo = new BigDecimal("100.00");

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_equalAmounts() {
        TestObject testObj = new TestObject();
        testObj.amountFrom = new BigDecimal("50.00");
        testObj.amountTo = new BigDecimal("50.00");

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_invalidAmountRange() {
        TestObject testObj = new TestObject();
        testObj.amountFrom = new BigDecimal("100.00");
        testObj.amountTo = new BigDecimal("10.00");

        assertFalse(validator.isValid(testObj, context));
    }

    @Test
    void test_nullObject() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    void test_bothAmountsNull() {
        TestObject testObj = new TestObject();
        testObj.amountFrom = null;
        testObj.amountTo = null;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_oneAmountNull() {
        TestObject testObj = new TestObject();
        testObj.amountFrom = new BigDecimal("10.00");
        testObj.amountTo = null;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_numberTypes() {
        TestObjectWithNumbers testObj = new TestObjectWithNumbers();
        testObj.amountFrom = 10.0;
        testObj.amountTo = 100.0;

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_stringNumbers() {
        TestObjectWithStrings testObj = new TestObjectWithStrings();
        testObj.amountFrom = "10.00";
        testObj.amountTo = "100.00";

        assertTrue(validator.isValid(testObj, context));
    }

    @Test
    void test_invalidStringNumbers() {
        // invalid strings should be handled by other validators
        TestObjectWithStrings testObj = new TestObjectWithStrings();
        testObj.amountFrom = "invalid";
        testObj.amountTo = "100.00";

        assertTrue(validator.isValid(testObj, context));
    }

    @Data
    static class TestObject {
        private BigDecimal amountFrom;
        private BigDecimal amountTo;
    }

    @Data
    static class TestObjectWithNumbers {
        private Double amountFrom;
        private Double amountTo;
    }

    @Data
    static class TestObjectWithStrings {
        private String amountFrom;
        private String amountTo;
    }
}