package com.exence.finance.modules.statistics.dto;

import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;

public class WidgetTypeDeserializer extends StdDeserializer<WidgetType> {

    public WidgetTypeDeserializer() {
        super(WidgetType.class);
    }

    @Override
    public WidgetType deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        try {
            return StatisticsWidgetType.valueOf(value);
        } catch (IllegalArgumentException ignored) {
        }
        try {
            return GoalWidgetType.valueOf(value);
        } catch (IllegalArgumentException ignored) {
        }
        try {
            return DebtWidgetType.valueOf(value);
        } catch (IllegalArgumentException ignored) {
        }
        try {
            return AdminWidgetType.valueOf(value);
        } catch (IllegalArgumentException ignored) {
        }
        try {
            return InvestmentWidgetType.valueOf(value);
        } catch (IllegalArgumentException ignored) {
        }
        throw ctxt.weirdStringException(value, WidgetType.class, "Unknown widget type: " + value);
    }
}
