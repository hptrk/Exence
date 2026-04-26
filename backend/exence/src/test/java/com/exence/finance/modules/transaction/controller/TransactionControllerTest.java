package com.exence.finance.modules.transaction.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.TransactionTestFixtures;
import com.exence.finance.modules.transaction.controller.impl.TransactionControllerImpl;
import com.exence.finance.modules.transaction.dto.TransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.TransactionGetDTO;
import com.exence.finance.modules.transaction.dto.TransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionTotalsResponse;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.service.TransactionService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(TransactionControllerImpl.class)
class TransactionControllerTest extends BaseControllerTest {

    @MockitoBean
    private TransactionService transactionService;

    // --- POST /api/transactions ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions - creates transaction and returns 201")
    void create() throws Exception {
        // given
        TransactionCreateDTO request = TransactionTestFixtures.createRequest(1L);
        TransactionGetDTO response = TransactionTestFixtures.getDTO(1L);
        given(transactionService.createTransaction(request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/transactions", request);

        // then
        result.andExpect(status().isCreated());
        TransactionGetDTO body = fromJson(result, TransactionGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(response);
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions - 400 when title is blank")
    void create_blankTitle_returns400() throws Exception {
        // given
        TransactionCreateDTO request = new TransactionCreateDTO(
                "",
                null,
                LocalDate.of(2026, 1, 15),
                new BigDecimal("5000.00"),
                TransactionType.EXPENSE,
                1L,
                null,
                null);

        // when
        ResultActions result = performPost("/api/transactions", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("title");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions - 400 when amount is negative")
    void create_negativeAmount_returns400() throws Exception {
        // given
        TransactionCreateDTO request = new TransactionCreateDTO(
                "Groceries",
                null,
                LocalDate.of(2026, 1, 15),
                new BigDecimal("-100.00"),
                TransactionType.EXPENSE,
                1L,
                null,
                null);

        // when
        ResultActions result = performPost("/api/transactions", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("amount");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions - 400 when categoryId is null")
    void create_nullCategoryId_returns400() throws Exception {
        // given
        TransactionCreateDTO request = new TransactionCreateDTO(
                "Groceries",
                null,
                LocalDate.of(2026, 1, 15),
                new BigDecimal("5000.00"),
                TransactionType.EXPENSE,
                null,
                null,
                null);

        // when
        ResultActions result = performPost("/api/transactions", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("categoryId");
    }

    @Test
    @DisplayName("POST /api/transactions - 401 when unauthenticated")
    void create_unauthenticated_returns401() throws Exception {
        performPost("/api/transactions", TransactionTestFixtures.createRequest(1L))
                .andExpect(status().isUnauthorized());
    }

    // --- GET /api/transactions ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/transactions - returns paginated transaction list")
    void getAll() throws Exception {
        // given
        given(transactionService.getTransactions(any(), any())).willReturn(Page.empty());

        // when / then
        performGet("/api/transactions")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    // --- GET /api/transactions/{id} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/transactions/{id} - returns transaction by id")
    void getById() throws Exception {
        // given
        TransactionGetDTO dto = TransactionTestFixtures.getDTO(1L);
        given(transactionService.getTransactionById(1L)).willReturn(dto);

        // when
        ResultActions result = performGet("/api/transactions/{id}", 1L);

        // then
        result.andExpect(status().isOk());
        TransactionGetDTO body = fromJson(result, TransactionGetDTO.class);
        assertThat(body).usingRecursiveComparison().isEqualTo(dto);
    }

    // --- PATCH /api/transactions/{id} ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/transactions/{id} - updates transaction and returns updated DTO")
    void update() throws Exception {
        // given
        TransactionPatchDTO request = TransactionTestFixtures.patchRequest();
        TransactionGetDTO updated = TransactionTestFixtures.getDTO(1L);
        given(transactionService.updateTransaction(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/transactions/{id}", request, 1L);

        // then
        result.andExpect(status().isOk());
        TransactionGetDTO body = fromJson(result, TransactionGetDTO.class);
        assertThat(body.id()).isEqualTo(1L);
    }

    // --- DELETE /api/transactions/{id} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/transactions/{id} - deletes transaction and returns 204")
    void delete() throws Exception {
        // given
        willDoNothing().given(transactionService).deleteTransaction(1L);

        // when / then
        performDelete("/api/transactions/{id}", 1L).andExpect(status().isNoContent());
    }

    // --- GET /api/transactions/totals ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/transactions/totals - returns income and expense totals")
    void getTotals() throws Exception {
        // given
        TransactionTotalsResponse response = TransactionTestFixtures.totalsResponse();
        given(transactionService.getTransactionTotals()).willReturn(response);

        // when
        ResultActions result = performGet("/api/transactions/totals");

        // then
        result.andExpect(status().isOk());
        TransactionTotalsResponse body = fromJson(result, TransactionTotalsResponse.class);
        assertThat(body.totalIncome()).isEqualByComparingTo(new BigDecimal("10000.00"));
        assertThat(body.totalExpense()).isEqualByComparingTo(new BigDecimal("5000.00"));
    }
}
