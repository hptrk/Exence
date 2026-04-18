package com.exence.finance.modules.statistics.service.provider.debt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.debt.repository.DebtRepository;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import java.math.BigDecimal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DebtTotalIOweStatCardProviderTest {

    @Mock
    private DebtRepository debtRepository;

    @Mock
    private ProviderHelper providerHelper;

    @InjectMocks
    private DebtTotalIOweStatCardProvider provider;

    @Test
    @DisplayName("returns DEBT_TOTAL_I_OWE_STATCARD as the supported widget type")
    void getSupportedType_returnsDebtTotalIOweStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD);
    }

    @Test
    @DisplayName("returns total borrowed debt amount with currency symbol")
    void getData_returnsBorrowedDebtTotal() {
        // given
        given(debtRepository.sumRemainingBaseCurrencyAmountByTypeAndStatus(DebtType.BORROWED, DebtStatus.ACTIVE))
                .willReturn(new BigDecimal("1500.00"));
        given(providerHelper.getUserCurrencySymbol()).willReturn("€");

        // when
        StatCardPayload result = provider.getData();

        // then
        assertThat(result.type()).isEqualTo(DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("1500.00"));
        assertThat(result.unit()).isEqualTo("€");
    }
}
