package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.HeatmapResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class SpendingHeatmapProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final I18nService i18nService;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.SPENDING_HEATMAP;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<HeatmapResult> results = statisticsQueryService.findWeeklyHeatmapExpense(filter);

        int totalWeeks = DateUtils.getIsoWeekCount(request.startDate());

        Map<Integer, Map<Integer, BigDecimal>> byDay = results.stream()
                .collect(Collectors.groupingBy(
                        HeatmapResult::dayOfWeek,
                        Collectors.toMap(HeatmapResult::weekNumber, HeatmapResult::totalAmount)));

        List<SeriesItem> series = new ArrayList<>();
        for (int day = 1; day <= DateUtils.DAYS_PER_WEEK; day++) {
            Map<Integer, BigDecimal> weekData = byDay.getOrDefault(day, Map.of());
            List<DataPoint> points = new ArrayList<>();
            for (int week = 1; week <= totalWeeks; week++) {
                points.add(new DataPoint(week, weekData.getOrDefault(week, BigDecimal.ZERO), null));
            }
            series.add(new SeriesItem(i18nService.getDayName(day), null, null, points));
        }

        return new SeriesPayload(series);
    }
}
