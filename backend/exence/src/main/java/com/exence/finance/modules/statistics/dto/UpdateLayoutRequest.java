package com.exence.finance.modules.statistics.dto;

import com.exence.finance.modules.statistics.annotations.AtLeastOneNotEmpty;
import jakarta.validation.Valid;
import java.util.List;

@AtLeastOneNotEmpty
public record UpdateLayoutRequest(@Valid List<StatCardLayoutItem> statCards, @Valid List<ChartLayoutItem> charts) {}
