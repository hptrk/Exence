package com.exence.finance.modules.statistics.dto.result;

import java.sql.Date;
import java.time.LocalDate;

public record DailyCountResult(LocalDate date, long count) {

    public DailyCountResult(Date sqlDate, Long count) {
        this(sqlDate != null ? sqlDate.toLocalDate() : null, count != null ? count : 0L);
    }
}
