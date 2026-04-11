package com.exence.finance.modules.statistics.dto.admin;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

@Schema(description = "Enumeration of widget types available in the admin dashboard module.")
public enum AdminWidgetType implements WidgetType {
    DAILY_ACTIVE_USERS,
    MONTHLY_ACTIVE_USERS,
    TRANSACTION_VELOCITY,
    DATABASE_GROWTH_SUMMARY,
    CURRENCY_DISTRIBUTION,
    AVG_TRANSACTIONS_PER_USER,
    TRANSACTION_TYPE_DISTRIBUTION,
    TOP_ACTIVE_USERS,
    EMAIL_VERIFICATION_RATE;

    public static final Set<AdminWidgetType> STAT_CARD_TYPES =
            EnumSet.of(DATABASE_GROWTH_SUMMARY, TOP_ACTIVE_USERS, EMAIL_VERIFICATION_RATE);

    public static final Set<AdminWidgetType> GRAPH_TYPES =
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
