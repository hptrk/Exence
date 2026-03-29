package com.exence.finance.modules.statistics.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public enum Timeframe {
    ONE_WEEK("1W", 7, ChronoUnit.DAYS),
    ONE_MONTH("1M", 1, ChronoUnit.MONTHS),
    THREE_MONTHS("3M", 3, ChronoUnit.MONTHS),
    SIX_MONTHS("6M", 6, ChronoUnit.MONTHS),
    ONE_YEAR("1Y", 1, ChronoUnit.YEARS),
    YTD("YTD", 0, null),
    ALL_TIME("ALL", 0, null);

    private final String code;
    private final int amount;
    private final ChronoUnit unit;

    Timeframe(String code, int amount, ChronoUnit unit) {
        this.code = code;
        this.amount = amount;
        this.unit = unit;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    public LocalDate toStartDate() {
        if (this == ALL_TIME) {
            return null;
        }
        if (this == YTD) {
            return LocalDate.now().withDayOfYear(1);
        }
        return LocalDate.now().minus(amount, unit);
    }

    // fallback to YTD if null or unrecognized
    @JsonCreator
    public static Timeframe fromCode(String code) {
        if (code == null) return YTD;
        for (Timeframe t : values()) {
            if (t.code.equalsIgnoreCase(code)) return t;
        }

        return YTD;
    }

    /**
     * Computes the start of the previous period for trend comparison.
     * For YTD: same dates shifted back 1 year.
     * For fixed durations: mirrors the duration before currentStart.
     * All time has no previous period, so returns null.
     */
    public LocalDate previousPeriodStart(LocalDate currentStart) {
        if (this == ALL_TIME) {
            return null;
        }
        if (this == YTD) {
            return currentStart.minusYears(1);
        }
        return currentStart.minus(amount, unit);
    }

    /**
     * Computes the end of the previous period for trend comparison.
     * For YTD: same end date shifted back 1 year.
     * For others: the current period's start.
     */
    public LocalDate previousPeriodEnd(LocalDate currentStart, LocalDate currentEnd) {
        if (this == YTD) {
            return currentEnd.minusYears(1);
        }
        return currentStart;
    }
}
