package com.exence.finance.modules.statistics.service.provider.investment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.investment.repository.InvestmentRepository;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import java.math.BigDecimal;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InvestmentTotalValueStatCardProviderTest {

    @Mock
    private InvestmentRepository investmentRepository;

    @Mock
    private ProviderHelper providerHelper;

    @InjectMocks
    private InvestmentTotalValueStatCardProvider provider;

    @BeforeEach
    void setUp() {
        WorkspaceContextHolder.setWorkspaceId(1L);
    }

    @AfterEach
    void tearDown() {
        WorkspaceContextHolder.clear();
    }

    @Test
    @DisplayName("returns INVESTMENT_TOTAL_VALUE_STATCARD as the supported widget type")
    void getSupportedType_returnsInvestmentTotalValueStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD);
    }

    @Test
    @DisplayName("returns total investment value in base currency with currency symbol")
    void getData_returnsTotalValue() {
        // given
        given(investmentRepository.sumBaseCurrencyAmountByWorkspaceId(anyLong()))
                .willReturn(new BigDecimal("50000.00"));
        given(providerHelper.getUserCurrencySymbol()).willReturn("€");

        // when
        StatCardPayload result = provider.getData();

        // then
        assertThat(result.type()).isEqualTo(InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("50000.00"));
        assertThat(result.unit()).isEqualTo("€");
    }
}
