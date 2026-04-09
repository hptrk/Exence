package com.exence.finance.modules.statistics.service.provider.investment;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.investment.repository.InvestmentRepository;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class InvestmentAssetCountStatCardProvider implements InvestmentWidgetDataProvider {

    private final InvestmentRepository investmentRepository;
    private final UserService userService;
    private final I18nService i18n;

    @Override
    public InvestmentWidgetType getSupportedType() {
        return InvestmentWidgetType.INVESTMENT_ASSET_COUNT_STATCARD;
    }

    @Override
    public StatCardPayload getData() {
        Long userId = userService.getCurrentUserId();
        long count = investmentRepository.countDistinctAssetsByUserId(userId);
        return new StatCardPayload(
                BigDecimal.valueOf(count), i18n.get("label.investment.assets"), null, null, null, null, null);
    }
}
