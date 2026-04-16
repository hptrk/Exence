package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.MonthlyIncomeExpenseResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.statistics.util.StatisticsConstants;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TransactionCountExpenseComboProvider implements WidgetDataProvider {

    private final I18nService i18n;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;
    private final ProviderHelper providerHelper;

    @Override
    public StatisticsWidgetType getSupportedType() {
        return StatisticsWidgetType.TRANSACTION_COUNT_EXPENSE_COMBO;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<MonthlyIncomeExpenseResult> results = statisticsQueryService.findMonthlyIncomeExpense(filter);

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DataPoint> expensePoints = new ArrayList<>();
        List<DataPoint> countPoints = new ArrayList<>();

        months.forEach(month -> {
            Optional<MonthlyIncomeExpenseResult> value = providerHelper.findByMonth(results, month);

            BigDecimal expense =
                    value.map(MonthlyIncomeExpenseResult::expenseAmount).orElse(BigDecimal.ZERO);
            long count = value.map(MonthlyIncomeExpenseResult::transactionCount).orElse(0L);

            expensePoints.add(new DataPoint(month.toString(), expense, null));
            countPoints.add(new DataPoint(month.toString(), BigDecimal.valueOf(count), null));
        });

        return new SeriesPayload(
                getSupportedType(),
                List.of(
                        new SeriesItem(
                                i18n.get("label.expense"),
                                "column",
                                StatisticsConstants.COLOR_EXPENSE_RED,
                                expensePoints),
                        new SeriesItem(i18n.get("label.transaction-count"), "line", null, countPoints)));
    }
}
