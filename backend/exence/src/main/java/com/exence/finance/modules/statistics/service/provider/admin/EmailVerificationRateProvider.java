package com.exence.finance.modules.statistics.service.provider.admin;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class EmailVerificationRateProvider implements AdminWidgetDataProvider {

    private static final int PERCENTAGE_MULTIPLIER = 100;

    private final I18nService i18n;
    private final AdminStatisticsQueryService adminStatisticsQueryService;

    @Override
    public AdminWidgetType getSupportedType() {
        return AdminWidgetType.EMAIL_VERIFICATION_RATE;
    }

    @Override
    public StatCardPayload getData(AdminWidgetRequest request) {
        long totalUsers = adminStatisticsQueryService.countTotalUsers();
        long verifiedUsers = adminStatisticsQueryService.countVerifiedUsers();

        BigDecimal percentage = totalUsers > 0
                ? BigDecimal.valueOf(verifiedUsers)
                        .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                        .divide(BigDecimal.valueOf(totalUsers), 1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new StatCardPayload(
                percentage, "%", i18n.get("context.admin.of-users-verified"), null, null, null, null);
    }
}
