package com.exence.finance.common.util;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.experimental.UtilityClass;

// TODO: timezone AND Locale settings should be calculated from the user's profile settings
@UtilityClass
public final class DateUtils {

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

    public static String getMonthName(int monthNum) {
        return Month.of(monthNum).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
    }

    /** @param isoDayOfWeek ISO day-of-week (1 = Monday, 7 = Sunday) */
    public static String getDayName(int isoDayOfWeek) {
        return DayOfWeek.of(isoDayOfWeek).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
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
