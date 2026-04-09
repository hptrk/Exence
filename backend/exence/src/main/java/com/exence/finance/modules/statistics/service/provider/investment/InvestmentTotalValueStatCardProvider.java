package com.exence.finance.modules.statistics.service.provider.investment;

import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.investment.repository.InvestmentRepository;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class InvestmentTotalValueStatCardProvider implements InvestmentWidgetDataProvider {

    private final InvestmentRepository investmentRepository;
    private final UserService userService;
    private final ProviderHelper providerHelper;

    @Override
    public InvestmentWidgetType getSupportedType() {
        return InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD;
    }

    @Override
    public StatCardPayload getData() {
        Long userId = userService.getCurrentUserId();
        BigDecimal total = investmentRepository.sumBaseCurrencyAmountByUserId(userId);
        return new StatCardPayload(total, providerHelper.getUserCurrencySymbol(), null, null, null, null, null);
    }
}
