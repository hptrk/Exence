package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.MonthlyIncomeExpenseProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
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

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<MonthlyIncomeExpenseProjection> results =
                statisticsRepository.findMonthlyIncomeExpenseWithTransactionCount(
                        request.startDate(), request.endDate());

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DataPoint> expensePoints = new ArrayList<>();
        List<DataPoint> countPoints = new ArrayList<>();

        months.forEach(month -> {
            Optional<MonthlyIncomeExpenseProjection> value = ProviderHelper.findByMonth(results, month);

            BigDecimal expense =
                    value.map(MonthlyIncomeExpenseProjection::getExpenseAmount).orElse(BigDecimal.ZERO);
            long count = value.map(MonthlyIncomeExpenseProjection::getTransactionCount)
                    .orElse(0L);

            expensePoints.add(new DataPoint(month.toString(), expense, null));
            countPoints.add(new DataPoint(month.toString(), BigDecimal.valueOf(count), null));
        });

        return new SeriesPayload(List.of(
                new SeriesItem("Expense", "column", "todo: piros szin", expensePoints),
                new SeriesItem("Transaction Count", "line", null, countPoints)));
    }
}
