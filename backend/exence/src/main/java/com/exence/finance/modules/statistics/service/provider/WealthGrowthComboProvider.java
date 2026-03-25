package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.MonthlyBalanceResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.statistics.util.StatisticsConstants;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class WealthGrowthComboProvider implements WidgetDataProvider {

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.WEALTH_GROWTH_COMBO;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<MonthlyBalanceResult> results = statisticsQueryService.findMonthlyBalance(filter);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DataPoint> profitPoints = new ArrayList<>();
        List<DataPoint> cumulativePoints = new ArrayList<>();
        BigDecimal cumulative = BigDecimal.ZERO;

        for (YearMonth month : months) {
            BigDecimal balance = ProviderHelper.getAmount(results, month, MonthlyBalanceResult::totalAmount);

            cumulative = cumulative.add(balance);

            profitPoints.add(new DataPoint(month.toString(), balance, null));
            cumulativePoints.add(new DataPoint(month.toString(), cumulative, null));
        }

        return new SeriesPayload(List.of(
                new SeriesItem("Profit", "column", StatisticsConstants.COLOR_INCOME_GREEN, profitPoints),
                new SeriesItem("Cumulative Balance", "line", null, cumulativePoints)));
    }
}
