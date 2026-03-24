package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;
import java.time.Instant;

public record DailyTrendResult(Instant statDate, BigDecimal totalAmount) {}
