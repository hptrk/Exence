package com.exence.finance.modules.statistics.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.investment.InvestmentTotalValueStatCardProvider;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class InvestmentWidgetServiceImplTest {

    @Mock
    private InvestmentTotalValueStatCardProvider investmentTotalValueProvider;

    private InvestmentWidgetServiceImpl service;

    @BeforeEach
    void setUp() {
        given(investmentTotalValueProvider.getSupportedType())
                .willReturn(InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD);
        service = new InvestmentWidgetServiceImpl(List.of(investmentTotalValueProvider));
        ReflectionTestUtils.invokeMethod(service, "init");
    }

    @Test
    @DisplayName("routes to provider and returns response for known widget type")
    void getWidgetData_withKnownType() {
        // given
        StatCardPayload payload = new StatCardPayload(
                InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD,
                new BigDecimal("50000.00"),
                "€",
                null,
                null,
                null,
                null,
                null);
        given(investmentTotalValueProvider.getData()).willReturn(payload);

        // when
        InvestmentWidgetDataResponse response =
                service.getWidgetData(InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD);

        // then
        assertThat(response.payload()).isEqualTo(payload);
    }

    @Test
    @DisplayName("throws INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED for unknown widget type")
    void getWidgetData_withUnknownType() {
        assertThatThrownBy(() -> service.getWidgetData(InvestmentWidgetType.INVESTMENT_ASSET_COUNT_STATCARD))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED);
    }
}
