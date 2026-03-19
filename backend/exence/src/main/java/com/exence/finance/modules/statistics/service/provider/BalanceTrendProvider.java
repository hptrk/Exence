package com.exence.finance.modules.statistics.service.provider;

import static com.exence.finance.common.util.DateUtils.toDisplayDate;

import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class BalanceTrendProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;
    private final UserService userService;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.BALANCE_TREND;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<DataPoint> dataPoints = statisticsRepository
                .findCumulativeDailyBalance(userService.getCurrentUserId(), request.startDate(), request.endDate())
                .stream()
                .map(p -> new DataPoint(toDisplayDate(p.getStatDate()), p.getTotalAmount(), null))
                .toList();

        SeriesItem series = new SeriesItem("Balance", "area", null, dataPoints);
        return new SeriesPayload(List.of(series));
    }
}
