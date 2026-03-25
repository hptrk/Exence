package com.exence.finance.modules.statistics.dto.result;

import java.math.BigDecimal;

public record HeatmapResult(Integer dayOfWeek, Integer weekNumber, BigDecimal totalAmount) {}
