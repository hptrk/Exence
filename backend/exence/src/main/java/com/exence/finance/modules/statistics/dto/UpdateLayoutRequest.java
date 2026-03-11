package com.exence.finance.modules.statistics.dto;

import jakarta.validation.Valid;
import java.util.List;

public record UpdateLayoutRequest(@Valid List<StatCardLayoutItem> statCards, @Valid List<ChartLayoutItem> charts) {}
