package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.HeatmapProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
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

    private final StatisticsRepository statisticsRepository;
    private final UserService userService;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.SPENDING_HEATMAP;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<HeatmapProjection> results = statisticsRepository.findWeeklyHeatmapExpense(
                userService.getCurrentUserId(), request.startDate(), request.endDate());

        int totalWeeks = DateUtils.getIsoWeekCount(request.startDate());

        Map<Integer, Map<Integer, BigDecimal>> byDay = results.stream()
                .collect(Collectors.groupingBy(
                        HeatmapProjection::getDayOfWeek,
                        Collectors.toMap(HeatmapProjection::getWeekNumber, HeatmapProjection::getTotalAmount)));

        List<SeriesItem> series = new ArrayList<>();
        for (int day = 1; day <= DateUtils.DAYS_PER_WEEK; day++) {
            Map<Integer, BigDecimal> weekData = byDay.getOrDefault(day, Map.of());
            List<DataPoint> points = new ArrayList<>();
            for (int week = 1; week <= totalWeeks; week++) {
                points.add(new DataPoint(week, weekData.getOrDefault(week, BigDecimal.ZERO), null));
            }
            series.add(new SeriesItem(DateUtils.getDayName(day), null, null, points));
        }

        return new SeriesPayload(series);
    }
}
