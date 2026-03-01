package com.exence.finance.modules.statistics.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

public enum Timeframe {
    ONE_WEEK("1W", 7, ChronoUnit.DAYS),
    ONE_MONTH("1M", 1, ChronoUnit.MONTHS),
    THREE_MONTHS("3M", 3, ChronoUnit.MONTHS),
    SIX_MONTHS("6M", 6, ChronoUnit.MONTHS),
    ONE_YEAR("1Y", 1, ChronoUnit.YEARS),
    YTD("YTD", 0, null),
    ALL_TIME("ALL", Integer.MAX_VALUE, ChronoUnit.YEARS);

    private final String code;
    private final int amount;
    private final ChronoUnit unit;

    Timeframe(String code, int amount, ChronoUnit unit) {
        this.code = code;
        this.amount = amount;
        this.unit = unit;
    }

    public Instant toStartDate() {
        if (this == ALL_TIME) {
            return Instant.EPOCH;
        }
        if (this == YTD) {
            return LocalDate.now(ZoneOffset.UTC)
                    .withDayOfYear(1)
                    .atStartOfDay(ZoneOffset.UTC)
                    .toInstant();
        }
        return ZonedDateTime.now(ZoneOffset.UTC).minus(amount, unit).toInstant();
    }

    // fallback to 1y if null or unrecognized
    public static Timeframe fromCode(String code) {
        if (code == null) return YTD;
        for (Timeframe t : values()) {
            if (t.code.equalsIgnoreCase(code)) return t;
        }

        return YTD;
    }
}
