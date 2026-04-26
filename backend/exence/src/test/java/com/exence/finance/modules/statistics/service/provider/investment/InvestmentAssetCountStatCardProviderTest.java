package com.exence.finance.modules.statistics.service.provider.investment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.investment.repository.InvestmentRepository;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
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
class InvestmentAssetCountStatCardProviderTest {

    @Mock
    private InvestmentRepository investmentRepository;

    @Mock
    private I18nService i18n;

    @InjectMocks
    private InvestmentAssetCountStatCardProvider provider;

    @BeforeEach
    void setUp() {
        WorkspaceContextHolder.setWorkspaceId(1L);
    }

    @AfterEach
    void tearDown() {
        WorkspaceContextHolder.clear();
    }

    @Test
    @DisplayName("returns INVESTMENT_ASSET_COUNT_STATCARD as the supported widget type")
    void getSupportedType_returnsInvestmentAssetCountStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(InvestmentWidgetType.INVESTMENT_ASSET_COUNT_STATCARD);
    }

    @Test
    @DisplayName("returns count of distinct investment assets with assets unit label")
    void getData_returnsDistinctAssetCount() {
        // given
        given(investmentRepository.countDistinctAssetsByWorkspaceId(anyLong())).willReturn(5L);
        given(i18n.get("label.investment.assets")).willReturn("assets");

        // when
        StatCardPayload result = provider.getData();

        // then
        assertThat(result.type()).isEqualTo(InvestmentWidgetType.INVESTMENT_ASSET_COUNT_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.valueOf(5));
        assertThat(result.unit()).isEqualTo("assets");
    }
}
