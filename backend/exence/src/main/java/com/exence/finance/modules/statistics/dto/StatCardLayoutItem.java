package com.exence.finance.modules.statistics.dto;

import jakarta.validation.constraints.NotNull;

public record StatCardLayoutItem(@NotNull Long id, @NotNull Integer displayOrder) {}
