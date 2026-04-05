package com.exence.finance.modules.statistics.service.provider.admin;

import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public sealed interface AdminWidgetDataProvider
        permits AvgTransactionsPerUserProvider,
                CurrencyDistributionProvider,
                DailyActiveUsersProvider,
                DatabaseGrowthSummaryProvider,
                EmailVerificationRateProvider,
                MonthlyActiveUsersProvider,
                TopActiveUsersProvider,
                TransactionTypeDistributionProvider,
                TransactionVelocityProvider {

    AdminWidgetType getSupportedType();

    WidgetDataPayload getData(AdminWidgetRequest request);
}
