package com.exence.finance.modules.statistics.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.WidgetTestFixtures;
import com.exence.finance.common.fixtures.WorkspaceTestFixtures;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.entity.Widget;
import com.exence.finance.modules.statistics.mapper.WidgetMapper;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.repository.WidgetRepository;
import com.exence.finance.modules.statistics.service.WidgetSettingsValidator;
import com.exence.finance.modules.statistics.service.provider.BalanceTrendProvider;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.repository.WorkspaceRepository;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class WidgetServiceImplTest {

    @Mock
    private WidgetMapper widgetMapper;

    @Mock
    private WidgetRepository widgetRepository;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private WidgetSettingsValidator widgetSettingsValidator;

    @Mock
    private BalanceTrendProvider balanceTrendProvider;

    private WidgetServiceImpl widgetService;

    @BeforeEach
    void setUp() {
        given(balanceTrendProvider.getSupportedType()).willReturn(StatisticsWidgetType.BALANCE_TREND);
        widgetService = new WidgetServiceImpl(
                widgetMapper,
                widgetRepository,
                statisticsQueryService,
                workspaceRepository,
                widgetSettingsValidator,
                List.of(balanceTrendProvider));
        ReflectionTestUtils.invokeMethod(widgetService, "init");
    }

    @Test
    @DisplayName("routes to correct provider and returns data response")
    void getData_validType() {
        // given
        Widget widget = WidgetTestFixtures.widgetWithTimeframeAndSettings(
                1L, StatisticsWidgetType.BALANCE_TREND, Timeframe.YTD, Collections.emptyMap());
        SeriesPayload payload = new SeriesPayload(StatisticsWidgetType.BALANCE_TREND, List.of());

        given(widgetRepository.find(1L)).willReturn(Optional.of(widget));
        given(balanceTrendProvider.getData(any())).willReturn(payload);

        // when
        WidgetDataResponse response = widgetService.getWidgetData(1L, Timeframe.YTD);

        // then
        assertThat(response.widgetId()).isEqualTo(1L);
        assertThat(response.payload()).isEqualTo(payload);
        then(balanceTrendProvider).should().getData(any());
    }

    @Test
    @DisplayName("throws WIDGET_NOT_FOUND when widget does not exist")
    void getData_notFound() {
        // given
        given(widgetRepository.find(99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> widgetService.getWidgetData(99L, Timeframe.YTD))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WIDGET_NOT_FOUND);
    }

    @Test
    @DisplayName("falls back to earliest stat date when timeframe resolves to null start")
    void getData_allTimeTimeframe() {
        // given
        Widget widget = WidgetTestFixtures.widgetWithTimeframeAndSettings(
                1L, StatisticsWidgetType.BALANCE_TREND, Timeframe.ALL_TIME, Collections.emptyMap());
        LocalDate earliest = LocalDate.of(2023, 1, 1);
        SeriesPayload payload = new SeriesPayload(StatisticsWidgetType.BALANCE_TREND, List.of());

        given(widgetRepository.find(1L)).willReturn(Optional.of(widget));
        given(statisticsQueryService.findEarliestStatDate()).willReturn(earliest);
        given(balanceTrendProvider.getData(any())).willReturn(payload);

        // when
        widgetService.getWidgetData(1L, null);

        // then
        then(statisticsQueryService).should().findEarliestStatDate();
    }

    @Test
    @DisplayName("deletes widgets missing from update request and saves updated ones")
    void updateLayout_removesDeleted() {
        // given
        Widget w1 = WidgetTestFixtures.widgetWithIdAndType(1L, StatisticsWidgetType.BALANCE_TREND);
        Widget w2 = WidgetTestFixtures.widgetWithIdAndType(2L, StatisticsWidgetType.BALANCE_TREND);

        given(widgetRepository.findAllWidgets()).willReturn(List.of(w1, w2)).willReturn(List.of(w1));
        given(widgetMapper.mapToStatCardDTOList(any())).willReturn(List.of());
        given(widgetMapper.mapToChartDTOList(any())).willReturn(List.of());

        UpdateLayoutRequest request = new UpdateLayoutRequest(null, null);

        // when
        widgetService.updateLayout(request);

        // then
        then(widgetRepository).should().deleteAllByIdInBatch(List.of(1L, 2L));
    }

    @Test
    @DisplayName("saves DASHBOARD_BALANCE_TREND widget for workspace on creation")
    void createDefault_valid() {
        // given
        Workspace workspace = WorkspaceTestFixtures.defaultWorkspace();

        // when
        widgetService.createDefaultDashboardWidget(workspace);

        // then
        then(widgetRepository).should().save(any(Widget.class));
    }
}
