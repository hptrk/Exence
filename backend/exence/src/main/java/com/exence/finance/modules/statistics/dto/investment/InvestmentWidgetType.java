package com.exence.finance.modules.statistics.dto.investment;

import com.exence.finance.modules.statistics.dto.WidgetType;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

public enum InvestmentWidgetType implements WidgetType {
    INVESTMENT_TOTAL_VALUE_STATCARD,
    INVESTMENT_ASSET_COUNT_STATCARD;

    public static final Set<InvestmentWidgetType> STAT_CARD_TYPES =
            EnumSet.of(INVESTMENT_TOTAL_VALUE_STATCARD, INVESTMENT_ASSET_COUNT_STATCARD);

    public static final Set<InvestmentWidgetType> GRAPH_TYPES =
            Collections.unmodifiableSet(EnumSet.complementOf(EnumSet.copyOf(STAT_CARD_TYPES)));

    @Override
    public Set<? extends WidgetType> getStatCardTypes() {
        return STAT_CARD_TYPES;
    }

    @Override
    public Set<? extends WidgetType> getGraphTypes() {
        return GRAPH_TYPES;
    }
}
