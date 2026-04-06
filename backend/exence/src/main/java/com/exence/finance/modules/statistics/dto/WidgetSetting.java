package com.exence.finance.modules.statistics.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum WidgetSetting {
    ICON("icon"),
    ICON_COLOR("iconColor"),
    CONTEXT_LABEL("contextLabel"),
    CATEGORY_IDS("categoryIds"),
    GOAL_ID("goalId");

    private final String key;

    WidgetSetting(String key) {
        this.key = key;
    }

    @JsonValue
    public String getKey() {
        return key;
    }

    @JsonCreator
    public static WidgetSetting fromKey(String key) {
        for (WidgetSetting setting : values()) {
            if (setting.key.equals(key)) {
                return setting;
            }
        }
        throw new IllegalArgumentException("Unknown widget setting: " + key);
    }
}
