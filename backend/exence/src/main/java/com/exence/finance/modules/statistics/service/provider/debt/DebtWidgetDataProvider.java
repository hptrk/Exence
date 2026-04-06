package com.exence.finance.modules.statistics.service.provider.debt;

import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public sealed interface DebtWidgetDataProvider
        permits DebtTotalIOweStatCardProvider, DebtTotalOwedToMeStatCardProvider {

    DebtWidgetType getSupportedType();

    WidgetDataPayload getData();
}
