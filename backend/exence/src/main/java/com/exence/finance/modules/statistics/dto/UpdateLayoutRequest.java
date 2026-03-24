package com.exence.finance.modules.statistics.dto;

import jakarta.validation.Valid;
import java.util.List;

public record UpdateLayoutRequest(
        @Valid List<StatCardLayoutItemRequest> statCards, @Valid List<ChartLayoutItemRequest> charts) {}
