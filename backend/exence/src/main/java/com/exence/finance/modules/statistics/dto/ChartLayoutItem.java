package com.exence.finance.modules.statistics.dto;

import jakarta.validation.constraints.NotNull;

public record ChartLayoutItem(@NotNull Long id, @NotNull Integer x, @NotNull Integer y) {}
