package com.exence.finance.modules.statistics.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.goal.GoalActiveCountStatCardProvider;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class GoalWidgetServiceImplTest {

    @Mock
    private GoalActiveCountStatCardProvider goalActiveCountProvider;

    private GoalWidgetServiceImpl service;

    @BeforeEach
    void setUp() {
        given(goalActiveCountProvider.getSupportedType()).willReturn(GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD);
        service = new GoalWidgetServiceImpl(List.of(goalActiveCountProvider));
        ReflectionTestUtils.invokeMethod(service, "init");
    }

    @Test
    @DisplayName("routes to provider and returns response for known widget type")
    void getWidgetData_withKnownType() {
        // given
        StatCardPayload payload = new StatCardPayload(
                GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD, BigDecimal.ZERO, null, null, null, null, null, null);
        given(goalActiveCountProvider.getData(any())).willReturn(payload);

        // when
        GoalWidgetDataResponse response =
                service.getWidgetData(GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD, Timeframe.ONE_MONTH, null);

        // then
        assertThat(response.payload()).isEqualTo(payload);
    }

    @Test
    @DisplayName("defaults to ALL_TIME timeframe when timeframe is null")
    void getWidgetData_withNullTimeframe() {
        // given
        StatCardPayload payload = new StatCardPayload(
                GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD, BigDecimal.ZERO, null, null, null, null, null, null);
        given(goalActiveCountProvider.getData(any())).willReturn(payload);

        // when
        GoalWidgetDataResponse response = service.getWidgetData(GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD, null, null);

        // then
        assertThat(response.payload()).isEqualTo(payload);
    }

    @Test
    @DisplayName("passes goal ID in settings when goal ID is provided")
    void getWidgetData_withGoalId() {
        // given
        StatCardPayload payload = new StatCardPayload(
                GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD, BigDecimal.ZERO, null, null, null, null, null, null);
        given(goalActiveCountProvider.getData(any())).willReturn(payload);

        // when
        GoalWidgetDataResponse response =
                service.getWidgetData(GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD, Timeframe.YTD, 42L);

        // then
        assertThat(response.payload()).isEqualTo(payload);
    }

    @Test
    @DisplayName("throws GOAL_WIDGET_TYPE_NOT_SUPPORTED for unknown widget type")
    void getWidgetData_withUnknownType() {
        assertThatThrownBy(() ->
                        service.getWidgetData(GoalWidgetType.GOAL_AVG_PROGRESS_STATCARD, Timeframe.ONE_MONTH, null))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.GOAL_WIDGET_TYPE_NOT_SUPPORTED);
    }
}
