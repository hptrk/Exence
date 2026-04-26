package com.exence.finance.modules.investment.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.fixtures.InvestmentTestFixtures;
import com.exence.finance.modules.investment.controller.impl.InvestmentControllerImpl;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.investment.enums.InvestmentType;
import com.exence.finance.modules.investment.service.InvestmentService;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import com.exence.finance.modules.statistics.service.InvestmentWidgetService;
import com.fasterxml.jackson.core.type.TypeReference;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(InvestmentControllerImpl.class)
class InvestmentControllerTest extends BaseControllerTest {

    @MockitoBean
    private InvestmentService investmentService;

    @MockitoBean
    private InvestmentWidgetService investmentWidgetService;

    // --- GET /api/investments ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/investments - returns list of investments")
    void getInvestments() throws Exception {
        // given
        List<InvestmentGetDTO> investments = List.of(InvestmentTestFixtures.getDTO());
        given(investmentService.getInvestments()).willReturn(investments);

        // when
        ResultActions result = performGet("/api/investments");

        // then
        result.andExpect(status().isOk());
        List<InvestmentGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
    }

    @Test
    @DisplayName("GET /api/investments - 401 when unauthenticated")
    void getInvestments_unauthenticated_returns401() throws Exception {
        performGet("/api/investments").andExpect(status().isUnauthorized());
    }

    // --- GET /api/investments/grouped ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/investments/grouped - returns grouped investment list")
    void getGroupedInvestments() throws Exception {
        // given
        List<InvestmentGroupDTO> groups = List.of(InvestmentTestFixtures.groupDTO());
        given(investmentService.getGroupedInvestments()).willReturn(groups);

        // when
        ResultActions result = performGet("/api/investments/grouped");

        // then
        result.andExpect(status().isOk());
        List<InvestmentGroupDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
        assertThat(body.getFirst().name()).isEqualTo("Bitcoin");
    }

    // --- POST /api/investments ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/investments - creates investment and returns 201")
    void createInvestment() throws Exception {
        // given
        InvestmentCreateDTO request = InvestmentTestFixtures.createRequest();
        InvestmentGetDTO response = InvestmentTestFixtures.getDTO();
        given(investmentService.createInvestment(request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/investments", request);

        // then
        result.andExpect(status().isCreated());
        InvestmentGetDTO body = fromJson(result, InvestmentGetDTO.class);
        assertThat(body.asset()).isEqualTo("Bitcoin");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/investments - 400 when asset is blank")
    void createInvestment_blankAsset_returns400() throws Exception {
        // given
        InvestmentCreateDTO request = new InvestmentCreateDTO(
                "",
                java.time.LocalDate.of(2026, 1, 15),
                InvestmentType.CRYPTO,
                new BigDecimal("500000.00"),
                SupportedCurrency.HUF,
                null);

        // when
        ResultActions result = performPost("/api/investments", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("asset");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/investments - 400 when purchaseDate is null")
    void createInvestment_nullPurchaseDate_returns400() throws Exception {
        // given
        InvestmentCreateDTO request = new InvestmentCreateDTO(
                "Bitcoin", null, InvestmentType.CRYPTO, new BigDecimal("500000.00"), SupportedCurrency.HUF, null);

        // when
        ResultActions result = performPost("/api/investments", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("purchaseDate");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/investments - 400 when type is null")
    void createInvestment_nullType_returns400() throws Exception {
        // given
        InvestmentCreateDTO request = new InvestmentCreateDTO(
                "Bitcoin",
                java.time.LocalDate.of(2026, 1, 15),
                null,
                new BigDecimal("500000.00"),
                SupportedCurrency.HUF,
                null);

        // when
        ResultActions result = performPost("/api/investments", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("type");
    }

    @Test
    @DisplayName("POST /api/investments - 401 when unauthenticated")
    void createInvestment_unauthenticated_returns401() throws Exception {
        performPost("/api/investments", InvestmentTestFixtures.createRequest()).andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/investments/{id} ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/investments/{id} - updates investment and returns updated DTO")
    void patchInvestment() throws Exception {
        // given
        InvestmentPatchDTO request = InvestmentTestFixtures.patchRequest();
        InvestmentGetDTO updated = InvestmentTestFixtures.getDTO();
        given(investmentService.patchInvestment(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/investments/{id}", request, 1L);

        // then
        result.andExpect(status().isOk());
        InvestmentGetDTO body = fromJson(result, InvestmentGetDTO.class);
        assertThat(body.id()).isEqualTo(1L);
    }

    // --- DELETE /api/investments/{id} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/investments/{id} - deletes investment and returns 204")
    void deleteInvestment() throws Exception {
        // given
        willDoNothing().given(investmentService).deleteInvestment(1L);

        // when / then
        performDelete("/api/investments/{id}", 1L).andExpect(status().isNoContent());
    }

    // --- GET /api/investments/statistics/{type} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/investments/statistics/{type} - returns investment widget data")
    void getWidgetData() throws Exception {
        // given
        InvestmentWidgetDataResponse response = new InvestmentWidgetDataResponse(null);
        given(investmentWidgetService.getWidgetData(InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD))
                .willReturn(response);

        // when
        ResultActions result =
                performGet("/api/investments/statistics/{type}", InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD);

        // then
        result.andExpect(status().isOk());
    }
}
