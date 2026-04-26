package com.exence.finance.modules.debt.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.DebtTestFixtures;
import com.exence.finance.modules.debt.controller.impl.DebtControllerImpl;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.service.DebtService;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.debt.DebtWidgetType;
import com.exence.finance.modules.statistics.service.DebtWidgetService;
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

@WebMvcTest(DebtControllerImpl.class)
class DebtControllerTest extends BaseControllerTest {

    @MockitoBean
    private DebtService debtService;

    @MockitoBean
    private DebtWidgetService debtWidgetService;

    // --- GET /api/debts ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/debts - returns list of debts")
    void getDebts() throws Exception {
        // given
        List<DebtGetDTO> debts = List.of(DebtTestFixtures.getDTO(1L));
        given(debtService.getDebts(any(), any())).willReturn(debts);

        // when
        ResultActions result = performGet("/api/debts");

        // then
        result.andExpect(status().isOk());
        List<DebtGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
    }

    @Test
    @DisplayName("GET /api/debts - 401 when unauthenticated")
    void getDebts_unauthenticated_returns401() throws Exception {
        performGet("/api/debts").andExpect(status().isUnauthorized());
    }

    // --- GET /api/debts/{id} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/debts/{id} - returns debt by id")
    void getDebtById() throws Exception {
        // given
        DebtGetDTO dto = DebtTestFixtures.getDTO(1L);
        given(debtService.getDebtById(1L)).willReturn(dto);

        // when
        ResultActions result = performGet("/api/debts/{id}", 1L);

        // then
        result.andExpect(status().isOk());
        DebtGetDTO body = fromJson(result, DebtGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(dto);
    }

    // --- POST /api/debts ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/debts - creates debt and returns 201")
    void createDebt() throws Exception {
        // given
        DebtCreateDTO request = DebtTestFixtures.createRequest(1L);
        DebtGetDTO response = DebtTestFixtures.getDTO(1L);
        given(debtService.createDebt(request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/debts", request);

        // then
        result.andExpect(status().isCreated());
        DebtGetDTO body = fromJson(result, DebtGetDTO.class);
        assertThat(body.title()).isEqualTo("Car Loan");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/debts - 400 when title is blank")
    void createDebt_blankTitle_returns400() throws Exception {
        // given
        DebtCreateDTO request = new DebtCreateDTO(
                "",
                "John Doe",
                new BigDecimal("15000.00"),
                com.exence.finance.common.dto.SupportedCurrency.EUR,
                java.time.LocalDate.of(2026, 12, 31),
                com.exence.finance.modules.debt.enums.DebtType.BORROWED,
                1L);

        // when
        ResultActions result = performPost("/api/debts", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("title");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/debts - 400 when counterpartyName is blank")
    void createDebt_blankCounterpartyName_returns400() throws Exception {
        // given
        DebtCreateDTO request = new DebtCreateDTO(
                "Car Loan",
                "",
                new BigDecimal("15000.00"),
                com.exence.finance.common.dto.SupportedCurrency.EUR,
                java.time.LocalDate.of(2026, 12, 31),
                com.exence.finance.modules.debt.enums.DebtType.BORROWED,
                1L);

        // when
        ResultActions result = performPost("/api/debts", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("counterpartyName");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/debts - 400 when currency is null")
    void createDebt_nullCurrency_returns400() throws Exception {
        // given
        DebtCreateDTO request = new DebtCreateDTO(
                "Car Loan",
                "John Doe",
                new BigDecimal("15000.00"),
                null,
                java.time.LocalDate.of(2026, 12, 31),
                com.exence.finance.modules.debt.enums.DebtType.BORROWED,
                1L);

        // when
        ResultActions result = performPost("/api/debts", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("currency");
    }

    @Test
    @DisplayName("POST /api/debts - 401 when unauthenticated")
    void createDebt_unauthenticated_returns401() throws Exception {
        performPost("/api/debts", DebtTestFixtures.createRequest(1L)).andExpect(status().isUnauthorized());
    }

    // --- PATCH /api/debts/{id} ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/debts/{id} - updates debt and returns updated DTO")
    void patchDebt() throws Exception {
        // given
        DebtPatchDTO request = DebtTestFixtures.patchRequest();
        DebtGetDTO updated = DebtTestFixtures.getDTO(1L);
        given(debtService.patchDebt(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/debts/{id}", request, 1L);

        // then
        result.andExpect(status().isOk());
        DebtGetDTO body = fromJson(result, DebtGetDTO.class);
        assertThat(body.id()).isEqualTo(1L);
    }

    // --- PATCH /api/debts/{id}/payment ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/debts/{id}/payment - records payment and returns updated DTO")
    void makePayment() throws Exception {
        // given
        DebtPaymentDTO request = DebtTestFixtures.paymentRequest();
        DebtGetDTO updated = DebtTestFixtures.getDTO(1L);
        given(debtService.makePayment(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/debts/{id}/payment", request, 1L);

        // then
        result.andExpect(status().isOk());
        DebtGetDTO body = fromJson(result, DebtGetDTO.class);
        assertThat(body.id()).isEqualTo(1L);
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/debts/{id}/payment - 400 when amount is null")
    void makePayment_nullAmount_returns400() throws Exception {
        // given
        DebtPaymentDTO request = new DebtPaymentDTO(null);

        // when
        ResultActions result = performPatch("/api/debts/{id}/payment", request, 1L);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("amount");
    }

    // --- DELETE /api/debts/{id} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/debts/{id} - deletes debt and returns 204")
    void deleteDebt() throws Exception {
        // given
        willDoNothing().given(debtService).deleteDebt(1L);

        // when / then
        performDelete("/api/debts/{id}", 1L).andExpect(status().isNoContent());
    }

    // --- GET /api/debts/statistics/{type} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/debts/statistics/{type} - returns debt widget data")
    void getWidgetData() throws Exception {
        // given
        DebtWidgetDataResponse response = new DebtWidgetDataResponse(null);
        given(debtWidgetService.getWidgetData(DebtWidgetType.DEBT_TOTAL_OWED_TO_ME_STATCARD))
                .willReturn(response);

        // when
        ResultActions result =
                performGet("/api/debts/statistics/{type}", DebtWidgetType.DEBT_TOTAL_OWED_TO_ME_STATCARD);

        // then
        result.andExpect(status().isOk());
    }
}
