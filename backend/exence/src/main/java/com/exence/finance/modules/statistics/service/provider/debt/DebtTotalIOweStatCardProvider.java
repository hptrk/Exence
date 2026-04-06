package com.exence.finance.modules.statistics.service.provider.debt;

import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.debt.repository.DebtRepository;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class DebtTotalIOweStatCardProvider implements DebtWidgetDataProvider {

    private final DebtRepository debtRepository;
    private final ProviderHelper providerHelper;

    @Override
    public DebtWidgetType getSupportedType() {
        return DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD;
    }

    @Override
    public StatCardPayload getData() {
        BigDecimal total =
                debtRepository.sumRemainingBaseCurrencyAmountByTypeAndStatus(DebtType.BORROWED, DebtStatus.ACTIVE);
        return new StatCardPayload(total, providerHelper.getUserCurrencySymbol(), null, null, null, null, null);
    }
}
