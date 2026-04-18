package com.exence.finance.common.fixtures;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.entity.Widget;
import java.util.Map;

public final class WidgetTestFixtures {

    private WidgetTestFixtures() {}

    public static Widget widgetWithTimeframeAndSettings(
            Long id, StatisticsWidgetType type, Timeframe timeframe, Map<WidgetSetting, Object> settings) {
        return Widget.builder()
                .id(id)
                .type(type)
                .timeframe(timeframe)
                .settings(settings)
                .build();
    }

    public static Widget widgetWithIdAndType(Long id, StatisticsWidgetType type) {
        return Widget.builder().id(id).type(type).build();
    }
}
