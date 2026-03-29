package com.exence.finance.common.util;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import lombok.experimental.UtilityClass;

@UtilityClass
public final class DateUtils {

    public static final int DAYS_PER_WEEK = 7;

    public static final int DECEMBER = 12;
    public static final int LAST_WEEK_DECEMBER_DAY = 28; // dec 28 is always in the last week of the year

    public static String toDisplayDate(LocalDate date) {
        return date.toString();
    }

    public static List<YearMonth> getMonthsInRange(LocalDate startDate, LocalDate endDate) {
        List<YearMonth> months = new ArrayList<>();

        YearMonth current = YearMonth.from(startDate);
        YearMonth last = YearMonth.from(endDate);

        while (!current.isAfter(last)) {
            months.add(current);
            current = current.plusMonths(1);
        }

        return months;
    }

    public static int getIsoWeekCount(LocalDate date) {
        int year = date.getYear();
        return LocalDate.of(year, DECEMBER, LAST_WEEK_DECEMBER_DAY).get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    }

    public static long countMonths(LocalDate start, LocalDate end) {
        YearMonth startMonth = YearMonth.from(start);
        YearMonth endMonth = YearMonth.from(end);
        return Math.max(1, startMonth.until(endMonth, ChronoUnit.MONTHS) + 1);
    }

    public static long countDaysBetween(LocalDate start, LocalDate end) {
        return Math.max(1, ChronoUnit.DAYS.between(start, end) + 1);
    }
}
