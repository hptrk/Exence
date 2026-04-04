package com.exence.finance.modules.statistics.dto.admin;

import com.exence.finance.modules.statistics.dto.Timeframe;
import java.time.LocalDate;

public record AdminWidgetRequest(LocalDate startDate, LocalDate endDate, Timeframe timeframe) {}
