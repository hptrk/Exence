package com.exence.finance.validators;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.exence.finance.modules.statistics.dto.ChartLayoutItem;
import com.exence.finance.modules.statistics.dto.StatCardLayoutItem;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.validators.AtLeastOneNotEmptyValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class AtLeastOneNotEmptyValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    private AtLeastOneNotEmptyValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new AtLeastOneNotEmptyValidator();
    }

    @Test
    void test_nullRequest_returnsTrue() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    void test_bothListsNull_returnsFalse() {
        UpdateLayoutRequest request = new UpdateLayoutRequest(null, null);
        assertFalse(validator.isValid(request, context));
    }

    @Test
    void test_bothListsEmpty_returnsFalse() {
        UpdateLayoutRequest request = new UpdateLayoutRequest(Collections.emptyList(), Collections.emptyList());
        assertFalse(validator.isValid(request, context));
    }

    @Test
    void test_statCardsNull_chartsEmpty_returnsFalse() {
        UpdateLayoutRequest request = new UpdateLayoutRequest(null, Collections.emptyList());
        assertFalse(validator.isValid(request, context));
    }

    @Test
    void test_statCardsEmpty_chartsNull_returnsFalse() {
        UpdateLayoutRequest request = new UpdateLayoutRequest(Collections.emptyList(), null);
        assertFalse(validator.isValid(request, context));
    }

    @Test
    void test_onlyStatCards_returnsTrue() {
        UpdateLayoutRequest request = new UpdateLayoutRequest(List.of(new StatCardLayoutItem(1L, 0)), null);
        assertTrue(validator.isValid(request, context));
    }

    @Test
    void test_onlyStatCards_chartsEmpty_returnsTrue() {
        UpdateLayoutRequest request =
                new UpdateLayoutRequest(List.of(new StatCardLayoutItem(1L, 0)), Collections.emptyList());
        assertTrue(validator.isValid(request, context));
    }

    @Test
    void test_onlyCharts_returnsTrue() {
        UpdateLayoutRequest request = new UpdateLayoutRequest(null, List.of(new ChartLayoutItem(1L, 0, 0)));
        assertTrue(validator.isValid(request, context));
    }

    @Test
    void test_onlyCharts_statCardsEmpty_returnsTrue() {
        UpdateLayoutRequest request =
                new UpdateLayoutRequest(Collections.emptyList(), List.of(new ChartLayoutItem(1L, 0, 0)));
        assertTrue(validator.isValid(request, context));
    }

    @Test
    void test_bothPresent_returnsTrue() {
        UpdateLayoutRequest request =
                new UpdateLayoutRequest(List.of(new StatCardLayoutItem(1L, 0)), List.of(new ChartLayoutItem(2L, 0, 0)));
        assertTrue(validator.isValid(request, context));
    }

    @Test
    void test_multipleStatCards_returnsTrue() {
        UpdateLayoutRequest request = new UpdateLayoutRequest(
                List.of(new StatCardLayoutItem(1L, 0), new StatCardLayoutItem(2L, 1), new StatCardLayoutItem(3L, 2)),
                null);
        assertTrue(validator.isValid(request, context));
    }

    @Test
    void test_multipleCharts_returnsTrue() {
        UpdateLayoutRequest request =
                new UpdateLayoutRequest(null, List.of(new ChartLayoutItem(1L, 0, 0), new ChartLayoutItem(2L, 1, 0)));
        assertTrue(validator.isValid(request, context));
    }
}
