package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.validators.WidgetLayoutValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
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
        validator = new WidgetLayoutValidator();
    }

    private void givenViolationContextConfigured() {
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);
        given(builder.addPropertyNode(anyString())).willReturn(nodeBuilder);
    }

    @Test
    void validate_nullDto() {
        assertThat(validator.isValid(null, context)).isTrue();
    }

    @Test
    void validate_nullType() {
        WidgetCreateDTO dto = dto(null, null, null, null, null, null, null);
        assertThat(validator.isValid(dto, context)).isTrue();
    }

    @Test
    void validate_nullDto_doesNotDisableDefaultConstraint() {
        validator.isValid(null, context);
        verify(context, never()).disableDefaultConstraintViolation();
    }

    @Test
    void validate_statCard_valid_allTypes() {
        for (StatisticsWidgetType type : StatisticsWidgetType.STAT_CARD_TYPES) {
            WidgetCreateDTO dto = dto(type, null, 0, null, null, null, null);
            assertThat(validator.isValid(dto, context))
                    .as("Should be valid for %s", type)
                    .isTrue();
        }
    }

    @Test
    void validate_statCard_missingDisplayOrder() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.BURN_RATE_STATCARD, null, null, null, null, null, null);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_statCard_withX() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.BURN_RATE_STATCARD, null, 1, 0, null, null, null);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_statCard_withY() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.BURN_RATE_STATCARD, null, 1, null, 0, null, null);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_statCard_allInvalid() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.BURN_RATE_STATCARD, null, null, 0, 0, 0, 0);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_statCard_withCols() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.BURN_RATE_STATCARD, null, 1, null, null, 2, null);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_statCard_withRows() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.BURN_RATE_STATCARD, null, 1, null, null, null, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_statCard_withColsAndRows() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.BURN_RATE_STATCARD, null, 1, null, null, 2, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_graph_valid() {
        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, null, null, 0, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isTrue();
    }

    @Test
    void validate_graph_valid_withTimeframe() {
        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, Timeframe.ONE_MONTH, null, 2, 3, 4, 4);
        assertThat(validator.isValid(dto, context)).isTrue();
    }

    @Test
    void validate_graph_missingX() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, null, null, null, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_graph_missingY() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, null, null, 0, null, 2, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_graph_missingCols() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, null, null, 0, 0, null, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_graph_missingRows() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, null, null, 0, 0, 2, null);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_graph_withDisplayOrder() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, null, 1, 0, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_graph_allInvalid() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, null, 1, null, null, null, null);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_ytdOnlyGraph_withYtdTimeframe() {
        WidgetCreateDTO dto = dto(StatisticsWidgetType.SPENDING_HEATMAP, Timeframe.YTD, null, 0, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isTrue();
    }

    @Test
    void validate_ytdOnlyGraph_withNullTimeframe() {
        WidgetCreateDTO dto = dto(StatisticsWidgetType.SPENDING_HEATMAP, null, null, 0, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isTrue();
    }

    @Test
    void validate_ytdOnlyGraph_withNonYtdTimeframe() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.SPENDING_HEATMAP, Timeframe.ONE_MONTH, null, 0, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_ytdOnlyGraph_withOneWeekTimeframe() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.SPENDING_HEATMAP, Timeframe.ONE_WEEK, null, 0, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_ytdOnlyGraph_withAllTimeTimeframe() {
        givenViolationContextConfigured();

        WidgetCreateDTO dto = dto(StatisticsWidgetType.SPENDING_HEATMAP, Timeframe.ALL_TIME, null, 0, 0, 2, 2);
        assertThat(validator.isValid(dto, context)).isFalse();
    }

    @Test
    void validate_nonYtdOnlyGraph_withAnyTimeframe() {
        for (Timeframe tf : Timeframe.values()) {
            WidgetCreateDTO dto = dto(StatisticsWidgetType.EXPENSE_TREND, tf, null, 0, 0, 2, 2);
            assertThat(validator.isValid(dto, context))
                    .as("Should be valid with timeframe %s", tf)
                    .isTrue();
        }
    }

    private WidgetCreateDTO dto(
            StatisticsWidgetType type,
            Timeframe timeframe,
            Integer displayOrder,
            Integer x,
            Integer y,
            Integer cols,
            Integer rows) {
        return new WidgetCreateDTO(type, null, timeframe, displayOrder, x, y, cols, rows, null);
    }
}
