package com.exence.finance.validators;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.validators.WidgetLayoutValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class WidgetLayoutValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder.NodeBuilderCustomizableContext nodeBuilder;

    private WidgetLayoutValidator validator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new WidgetLayoutValidator();

        lenient()
                .when(context.buildConstraintViolationWithTemplate(anyString()))
                .thenReturn(builder);
        lenient().when(builder.addPropertyNode(anyString())).thenReturn(nodeBuilder);
        lenient().when(nodeBuilder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();
    }

    @Test
    void test_nullDto_returnsTrue() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    void test_nullType_returnsTrue() {
        WidgetCreateDTO dto = dto(null, null, null, null, null, null, null);
        assertTrue(validator.isValid(dto, context));
    }

    @Test
    void test_nullDto_doesNotDisableDefaultConstraint() {
        validator.isValid(null, context);
        verify(context, never()).disableDefaultConstraintViolation();
    }

    @Test
    void test_statCard_valid_allTypes() {
        for (WidgetType type : WidgetType.STAT_CARD_TYPES) {
            WidgetCreateDTO dto = dto(type, null, 0, null, null, null, null);
            assertTrue(validator.isValid(dto, context), "Should be valid for " + type);
        }
    }

    @Test
    void test_statCard_missingDisplayOrder_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.BURN_RATE_STATCARD, null, null, null, null, null, null);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_statCard_withX_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.BURN_RATE_STATCARD, null, 1, 0, null, null, null);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_statCard_withY_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.BURN_RATE_STATCARD, null, 1, null, 0, null, null);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_statCard_allInvalid_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.BURN_RATE_STATCARD, null, null, 0, 0, 0, 0);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_statCard_withCols_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.BURN_RATE_STATCARD, null, 1, null, null, 2, null);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_statCard_withRows_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.BURN_RATE_STATCARD, null, 1, null, null, null, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_statCard_withColsAndRows_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.BURN_RATE_STATCARD, null, 1, null, null, 2, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_graph_valid() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, null, null, 0, 0, 2, 2);
        assertTrue(validator.isValid(dto, context));
    }

    @Test
    void test_graph_valid_withTimeframe() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, Timeframe.ONE_MONTH, null, 2, 3, 4, 4);
        assertTrue(validator.isValid(dto, context));
    }

    @Test
    void test_graph_missingX_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, null, null, null, 0, 2, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_graph_missingY_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, null, null, 0, null, 2, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_graph_missingCols_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, null, null, 0, 0, null, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_graph_missingRows_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, null, null, 0, 0, 2, null);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_graph_withDisplayOrder_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, null, 1, 0, 0, 2, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_graph_allInvalid_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, null, 1, null, null, null, null);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_ytdOnlyGraph_withYtdTimeframe_returnsTrue() {
        WidgetCreateDTO dto = dto(WidgetType.SPENDING_HEATMAP, Timeframe.YTD, null, 0, 0, 2, 2);
        assertTrue(validator.isValid(dto, context));
    }

    @Test
    void test_ytdOnlyGraph_withNullTimeframe_returnsTrue() {
        WidgetCreateDTO dto = dto(WidgetType.SPENDING_HEATMAP, null, null, 0, 0, 2, 2);
        assertTrue(validator.isValid(dto, context));
    }

    @Test
    void test_ytdOnlyGraph_withNonYtdTimeframe_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.SPENDING_HEATMAP, Timeframe.ONE_MONTH, null, 0, 0, 2, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_ytdOnlyGraph_withOneWeekTimeframe_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.SPENDING_HEATMAP, Timeframe.ONE_WEEK, null, 0, 0, 2, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_ytdOnlyGraph_withAllTimeTimeframe_returnsFalse() {
        WidgetCreateDTO dto = dto(WidgetType.SPENDING_HEATMAP, Timeframe.ALL_TIME, null, 0, 0, 2, 2);
        assertFalse(validator.isValid(dto, context));
    }

    @Test
    void test_nonYtdOnlyGraph_withAnyTimeframe_returnsTrue() {
        for (Timeframe tf : Timeframe.values()) {
            WidgetCreateDTO dto = dto(WidgetType.EXPENSE_TREND, tf, null, 0, 0, 2, 2);
            assertTrue(validator.isValid(dto, context), "Should be valid with timeframe " + tf);
        }
    }

    private WidgetCreateDTO dto(
            WidgetType type,
            Timeframe timeframe,
            Integer displayOrder,
            Integer x,
            Integer y,
            Integer cols,
            Integer rows) {
        return new WidgetCreateDTO(type, null, timeframe, displayOrder, x, y, cols, rows, null);
    }
}
