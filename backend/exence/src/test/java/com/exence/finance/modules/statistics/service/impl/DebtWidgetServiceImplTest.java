package com.exence.finance.modules.statistics.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.debt.DebtTotalIOweStatCardProvider;
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
class DebtWidgetServiceImplTest {

    @Mock
    private DebtTotalIOweStatCardProvider debtTotalIOweProvider;

    private DebtWidgetServiceImpl service;

    @BeforeEach
    void setUp() {
        given(debtTotalIOweProvider.getSupportedType()).willReturn(DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD);
        service = new DebtWidgetServiceImpl(List.of(debtTotalIOweProvider));
        ReflectionTestUtils.invokeMethod(service, "init");
    }

    @Test
    @DisplayName("routes to provider and returns response for known widget type")
    void getWidgetData_withKnownType() {
        // given
        StatCardPayload payload = new StatCardPayload(
                DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD, BigDecimal.ZERO, "€", null, null, null, null, null);
        given(debtTotalIOweProvider.getData()).willReturn(payload);

        // when
        DebtWidgetDataResponse response = service.getWidgetData(DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD);

        // then
        assertThat(response.payload()).isEqualTo(payload);
    }

    @Test
    @DisplayName("throws DEBT_WIDGET_TYPE_NOT_SUPPORTED for unknown widget type")
    void getWidgetData_withUnknownType() {
        assertThatThrownBy(() -> service.getWidgetData(DebtWidgetType.DEBT_TOTAL_OWED_TO_ME_STATCARD))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DEBT_WIDGET_TYPE_NOT_SUPPORTED);
    }
}
