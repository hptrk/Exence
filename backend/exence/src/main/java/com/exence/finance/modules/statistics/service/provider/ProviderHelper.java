package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.CategoryAmountProjection;
import com.exence.finance.modules.statistics.dto.projection.MonthlyCategoryProjection;
import com.exence.finance.modules.statistics.dto.projection.base.CategoryProjection;
import com.exence.finance.modules.statistics.dto.projection.base.MonthlyProjection;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ProviderHelper {

    private static final int DIVISION_SCALE = 4;
    private static final int PERCENTAGE_MULTIPLIER = 100;
    private static final int DISPLAY_SCALE = 2;

    // --- BUILDERS ---

    public SeriesPayload buildMonthlyCategorySeriesPayload(
            List<MonthlyCategoryProjection> results, List<YearMonth> months, String seriesType, String totalColor) {
        Map<String, String> colors = getCategoryColorMap(results);

        // main series for each category
        List<SeriesItem> series = new ArrayList<>(colors.keySet().stream()
                .map(category -> {
                    List<DataPoint> points = months.stream()
                            .map(month -> new DataPoint(
                                    month.toString(), getCategoryAmountForMonth(results, category, month), null))
                            .toList();
                    return new SeriesItem(category, seriesType, colors.get(category), points);
                })
                .toList());

        // calculate totals
        if (totalColor != null) {
            List<DataPoint> totalPoints = months.stream()
                    .map(month -> {
                        BigDecimal total = results.stream()
                                .filter(r ->
                                        r.getStatYear() == month.getYear() && r.getStatMonth() == month.getMonthValue())
                                .map(MonthlyCategoryProjection::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                        return new DataPoint(month.toString(), total, null);
                    })
                    .toList();
            series.addFirst(new SeriesItem("Total", "line", totalColor, totalPoints));
        }

        return new SeriesPayload(series);
    }

    public DistributionPayload buildCategoryAmountDistributionPayload(List<CategoryAmountProjection> results) {
        List<DistributionItem> items = results.stream()
                .map(r -> new DistributionItem(r.getCategoryName(), r.getTotalAmount(), r.getCategoryColor()))
                .toList();
        return new DistributionPayload(items);
    }

    // --- UTILITIES ---

    public <T extends MonthlyProjection> Optional<T> findByMonth(List<T> results, YearMonth month) {
        return results.stream()
                .filter(r -> r.getStatYear() == month.getYear() && r.getStatMonth() == month.getMonthValue())
                .findFirst();
    }

    public <T extends MonthlyProjection> BigDecimal getAmount(
            List<T> results, YearMonth month, Function<T, BigDecimal> extractor) {
        return findByMonth(results, month).map(extractor).orElse(BigDecimal.ZERO);
    }

    public <T extends CategoryProjection> Set<String> getCategories(List<T> results) {
        return results.stream().map(CategoryProjection::getCategoryName).collect(Collectors.toSet());
    }

    public <T extends CategoryProjection> Map<String, String> getCategoryColorMap(List<T> results) {
        return results.stream()
                .collect(Collectors.toMap(
                        CategoryProjection::getCategoryName,
                        CategoryProjection::getCategoryColor,
                        (a, b) -> a,
                        LinkedHashMap::new));
    }

    public BigDecimal getCategoryAmountForMonth(
            List<MonthlyCategoryProjection> results, String category, YearMonth month) {
        return results.stream()
                .filter(r -> r.getCategoryName().equals(category)
                        && r.getStatYear() == month.getYear()
                        && r.getStatMonth() == month.getMonthValue())
                .map(MonthlyCategoryProjection::getTotalAmount)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }

    public BigDecimal calculateSavingsRate(BigDecimal income, BigDecimal expense) {
        if (income.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return income.subtract(expense)
                .divide(income, DIVISION_SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                .setScale(DISPLAY_SCALE, RoundingMode.HALF_UP);
    }

    public BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bd) {
            return bd;
        }
        if (value instanceof Number n) {
            return BigDecimal.valueOf(n.doubleValue());
        }
        return BigDecimal.ZERO;
    }
}
