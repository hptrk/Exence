package com.exence.finance.modules.statistics.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record StatCardLayoutItemRequest(
        @NotNull Long id, @NotNull Integer displayOrder, Map<WidgetSetting, Object> settings, String title) {}
