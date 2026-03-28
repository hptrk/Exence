package com.exence.finance.common.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import lombok.experimental.UtilityClass;

@UtilityClass
public final class DateUtils {

    // TODO: timezone handling based on user settings
    public static final ZoneId DISPLAY_ZONE = ZoneId.of("Europe/Budapest");
    public static final int DAYS_PER_WEEK = 7;

    public static final int DECEMBER = 12;
    public static final int LAST_WEEK_DECEMBER_DAY = 28; // dec 28 is always in the last week of the year

    public static String toDisplayDate(Instant instant) {
        return instant.atZone(DISPLAY_ZONE).toLocalDate().toString();
    }

    public static List<YearMonth> getMonthsInRange(Instant startDate, Instant endDate) {
        List<YearMonth> months = new ArrayList<>();

        YearMonth current = YearMonth.from(startDate.atZone(DISPLAY_ZONE));
        YearMonth last = YearMonth.from(endDate.atZone(DISPLAY_ZONE));

        while (!current.isAfter(last)) {
            months.add(current);
            current = current.plusMonths(1);
        }

        return months;
    }

    public static int getIsoWeekCount(Instant instant) {
        int year = instant.atZone(DISPLAY_ZONE).getYear();
        return LocalDate.of(year, DECEMBER, LAST_WEEK_DECEMBER_DAY).get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    }

    public static long countMonths(Instant start, Instant end) {
        YearMonth startMonth = YearMonth.from(start.atZone(ZoneOffset.UTC));
        YearMonth endMonth = YearMonth.from(end.atZone(ZoneOffset.UTC));
        return Math.max(1, startMonth.until(endMonth, ChronoUnit.MONTHS) + 1);
    }

    public static long countDaysBetween(Instant start, Instant end) {
        return Math.max(1, ChronoUnit.DAYS.between(start, end) + 1);
    }
}
