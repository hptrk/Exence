package com.exence.finance.modules.statistics.service.provider.investment;

import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public sealed interface InvestmentWidgetDataProvider
        permits InvestmentTotalValueStatCardProvider, InvestmentAssetCountStatCardProvider {

    InvestmentWidgetType getSupportedType();

    WidgetDataPayload getData();
}
