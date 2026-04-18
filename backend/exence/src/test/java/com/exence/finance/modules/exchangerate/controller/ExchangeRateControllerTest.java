package com.exence.finance.modules.exchangerate.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.exchangerate.controller.impl.ExchangeRateControllerImpl;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(ExchangeRateControllerImpl.class)
class ExchangeRateControllerTest extends BaseControllerTest {

    @MockitoBean
    private ExchangeRateService exchangeRateService;

    // --- GET /api/exchange-rates ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/exchange-rates - returns exchange rate for given currencies and date")
    void getRate() throws Exception {
        // given
        given(exchangeRateService.getRate(SupportedCurrency.USD, SupportedCurrency.HUF, LocalDate.of(2026, 1, 15)))
                .willReturn(new BigDecimal("370.50"));

        // when
        ResultActions result = performGetNoWorkspace("/api/exchange-rates?from=USD&to=HUF&date=2026-01-15");

        // then
        result.andExpect(status().isOk());
        BigDecimal body = fromJson(result, BigDecimal.class);
        assertThat(body).isEqualByComparingTo(new BigDecimal("370.50"));
    }

    @Test
    @DisplayName("GET /api/exchange-rates - 401 when unauthenticated")
    void getRate_unauthenticated_returns401() throws Exception {
        performGetNoWorkspace("/api/exchange-rates?from=USD&to=HUF&date=2026-01-15")
                .andExpect(status().isUnauthorized());
    }
}
