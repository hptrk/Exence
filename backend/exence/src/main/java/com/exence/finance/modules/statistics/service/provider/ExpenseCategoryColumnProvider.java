package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.MonthlyCategoryProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class ExpenseCategoryColumnProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.EXPENSE_CATEGORY_COLUMN;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<MonthlyCategoryProjection> results = statisticsRepository.findMonthlyCategoryTotals(
                request.startDate(), request.endDate(), TransactionType.EXPENSE);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        return ProviderHelper.buildMonthlyCategorySeriesPayload(results, months, "column", null);
    }
}
