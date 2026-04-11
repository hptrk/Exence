package com.exence.finance.modules.statistics.dto.debt;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

@Schema(description = "Enumeration of widget types available in the debt tracking module.")
public enum DebtWidgetType implements WidgetType {
    DEBT_TOTAL_OWED_TO_ME_STATCARD,
    DEBT_TOTAL_I_OWE_STATCARD;

    public static final Set<DebtWidgetType> STAT_CARD_TYPES =
            EnumSet.of(DEBT_TOTAL_OWED_TO_ME_STATCARD, DEBT_TOTAL_I_OWE_STATCARD);

    public static final Set<DebtWidgetType> GRAPH_TYPES =
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
