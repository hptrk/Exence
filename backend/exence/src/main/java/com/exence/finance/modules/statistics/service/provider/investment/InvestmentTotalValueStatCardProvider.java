package com.exence.finance.modules.statistics.service.provider.investment;

import com.exence.finance.modules.investment.repository.InvestmentRepository;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class InvestmentTotalValueStatCardProvider implements InvestmentWidgetDataProvider {

    private final InvestmentRepository investmentRepository;
    private final ProviderHelper providerHelper;

    @Override
    public InvestmentWidgetType getSupportedType() {
        return InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD;
    }

    @Override
    public StatCardPayload getData() {
        BigDecimal total =
                investmentRepository.sumBaseCurrencyAmountByWorkspaceId(WorkspaceContextHolder.getWorkspaceId());
        return new StatCardPayload(
                getSupportedType(), total, providerHelper.getUserCurrencySymbol(), null, null, null, null, null);
    }
}
