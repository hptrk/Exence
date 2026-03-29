package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyTrendResult(LocalDate statDate, BigDecimal totalAmount) {}
