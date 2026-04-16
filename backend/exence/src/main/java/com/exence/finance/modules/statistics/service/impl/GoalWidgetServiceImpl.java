package com.exence.finance.modules.statistics.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;
import com.exence.finance.modules.statistics.service.GoalWidgetService;
import com.exence.finance.modules.statistics.service.provider.goal.GoalWidgetDataProvider;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoalWidgetServiceImpl implements GoalWidgetService {

    private static final LocalDate DEFAULT_START_DATE = LocalDate.of(2020, 1, 1);

    private final List<GoalWidgetDataProvider> providers;

    private Map<GoalWidgetType, GoalWidgetDataProvider> providerMap;

    @PostConstruct
    private void init() {
        this.providerMap = Map.copyOf(providers.stream()
                .collect(Collectors.toMap(GoalWidgetDataProvider::getSupportedType, Function.identity())));
    }

    @Override
    @ReadTransactional
    public GoalWidgetDataResponse getWidgetData(GoalWidgetType type, Timeframe timeframe, Long goalId) {
        Timeframe resolvedTimeframe = timeframe != null ? timeframe : Timeframe.ALL_TIME;

        LocalDate startDate = resolvedTimeframe.toStartDate();
        if (startDate == null) {
            startDate = DEFAULT_START_DATE;
        }

        Map<WidgetSetting, Object> settings = goalId != null ? Map.of(WidgetSetting.GOAL_ID, goalId) : null;
        WidgetRequest request = new WidgetRequest(startDate, LocalDate.now(), resolvedTimeframe, settings);

        GoalWidgetDataProvider provider = providerMap.get(type);
        if (provider == null) {
            log.error("No data provider for goal widget type: {}", type);
            throw new ExenceException(ErrorCode.GOAL_WIDGET_TYPE_NOT_SUPPORTED);
        }

        WidgetDataPayload payload = provider.getData(request);
        return new GoalWidgetDataResponse(payload);
    }
}
