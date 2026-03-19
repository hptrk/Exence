package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.payload.Trend;
import com.exence.finance.modules.statistics.dto.projection.CategoryAmountProjection;
import com.exence.finance.modules.statistics.dto.projection.MonthlyCategoryProjection;
import com.exence.finance.modules.statistics.dto.projection.TypeAmountProjection;
import com.exence.finance.modules.statistics.dto.projection.base.CategoryProjection;
import com.exence.finance.modules.statistics.dto.projection.base.MonthlyProjection;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;
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
            return new BigDecimal(n.toString());
        }
        return BigDecimal.ZERO;
    }

    // --- STAT CARD HELPERS ---

    public TrendResult computeTrend(
            WidgetRequest request, BigDecimal currentValue, BiFunction<Instant, Instant, BigDecimal> valueCalculator) {
        return doComputeTrend(request, currentValue, valueCalculator, ProviderHelper::calculateChangePercentage);
    }

    public TrendResult computeTrendByDifference(
            WidgetRequest request, BigDecimal currentValue, BiFunction<Instant, Instant, BigDecimal> valueCalculator) {
        return doComputeTrend(request, currentValue, valueCalculator, (prev, curr) -> curr.subtract(prev));
    }

    private TrendResult doComputeTrend(
            WidgetRequest request,
            BigDecimal currentValue,
            BiFunction<Instant, Instant, BigDecimal> valueCalculator,
            BiFunction<BigDecimal, BigDecimal, BigDecimal> changeCalculator) {
        Timeframe timeframe = request.timeframe();
        Instant prevStart = timeframe.previousPeriodStart(request.startDate(), request.endDate());
        if (prevStart == null) {
            return TrendResult.NEUTRAL;
        }
        Instant prevEnd = timeframe.previousPeriodEnd(request.startDate(), request.endDate());
        BigDecimal prevValue = valueCalculator.apply(prevStart, prevEnd);
        BigDecimal change = changeCalculator.apply(prevValue, currentValue);
        return new TrendResult(change, determineTrend(change));
    }

    public StatCardPayload buildFrequencyStatCard(
            WidgetRequest request, long currentCount, BiFunction<Instant, Instant, Long> countCalculator) {
        long currentMonths = DateUtils.countMonths(request.startDate(), request.endDate());
        BigDecimal currentAvg = divideAsAvg(currentCount, currentMonths);
        String unitLabel = getUnitLabel(currentAvg, "transaction", "transactions");

        TrendResult trend = computeTrend(request, currentAvg, (s, e) -> {
            long prevCount = countCalculator.apply(s, e);
            long prevMonths = DateUtils.countMonths(s, e);
            return divideAsAvg(prevCount, prevMonths);
        });

        return new StatCardPayload(
                currentAvg, unitLabel, "/month", trend.changePercentage(), trend.trend(), null, null);
    }

    public BigDecimal calculateChangePercentage(BigDecimal previous, BigDecimal current) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return current.subtract(previous)
                .divide(previous, DIVISION_SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                .setScale(DISPLAY_SCALE, RoundingMode.HALF_UP);
    }

    public Trend determineTrend(BigDecimal changePercentage) {
        int cmp = changePercentage.compareTo(BigDecimal.ZERO);
        if (cmp > 0) return Trend.UP;
        if (cmp < 0) return Trend.DOWN;
        return Trend.NEUTRAL;
    }

    public Map<TransactionType, BigDecimal> toTypeAmountMap(List<TypeAmountProjection> projections) {
        return projections.stream()
                .collect(Collectors.toMap(TypeAmountProjection::getType, TypeAmountProjection::getTotalAmount));
    }

    public BigDecimal calculatePercentage(BigDecimal part, BigDecimal total) {
        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return part.divide(total, DIVISION_SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                .setScale(1, RoundingMode.HALF_UP);
    }

    public String getUnitLabel(Number value, String singular, String plural) {
        BigDecimal bd = value instanceof BigDecimal bigDecimal ? bigDecimal : BigDecimal.valueOf(value.doubleValue());
        return bd.compareTo(BigDecimal.ONE) == 0 ? singular : plural;
    }

    private BigDecimal divideAsAvg(long count, long months) {
        return BigDecimal.valueOf(count).divide(BigDecimal.valueOf(months), 1, RoundingMode.HALF_UP);
    }
}
