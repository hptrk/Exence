package com.exence.finance.modules.transaction.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.common.fixtures.RecurringTransactionTestFixtures;
import com.exence.finance.modules.transaction.controller.impl.RecurringTransactionControllerImpl;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionGetDTO;
import com.exence.finance.modules.transaction.dto.RecurringTransactionPatchDTO;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.service.RecurringTransactionService;
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

@WebMvcTest(RecurringTransactionControllerImpl.class)
class RecurringTransactionControllerTest extends BaseControllerTest {

    @MockitoBean
    private RecurringTransactionService recurringTransactionService;

    // --- POST /api/transactions/recurring ---

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions/recurring - creates recurring transaction and returns 201")
    void create() throws Exception {
        // given
        RecurringTransactionCreateDTO request = RecurringTransactionTestFixtures.createRequest(1L);
        RecurringTransactionGetDTO response = RecurringTransactionTestFixtures.getDTO(1L);
        given(recurringTransactionService.create(request)).willReturn(response);

        // when
        ResultActions result = performPost("/api/transactions/recurring", request);

        // then
        result.andExpect(status().isCreated());
        RecurringTransactionGetDTO body = fromJson(result, RecurringTransactionGetDTO.class);
        assertThat(body.title()).isEqualTo("Netflix");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions/recurring - 400 when title is blank")
    void create_blankTitle_returns400() throws Exception {
        // given — create valid request then override title
        RecurringTransactionCreateDTO request = new RecurringTransactionCreateDTO(
                "",
                null,
                new BigDecimal("4500.00"),
                TransactionType.EXPENSE,
                1L,
                null,
                RecurrenceFrequency.MONTHLY,
                1,
                null,
                15,
                EndCondition.UNTIL_DATE,
                LocalDate.of(2027, 12, 31),
                null,
                LocalDate.of(2026, 1, 15));

        // when
        ResultActions result = performPost("/api/transactions/recurring", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("title");
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/transactions/recurring - 400 when frequency is null")
    void create_nullFrequency_returns400() throws Exception {
        // given
        RecurringTransactionCreateDTO request = new RecurringTransactionCreateDTO(
                "Netflix",
                null,
                new BigDecimal("4500.00"),
                TransactionType.EXPENSE,
                1L,
                null,
                null, // missing frequency
                1,
                null,
                null,
                EndCondition.UNTIL_DATE,
                LocalDate.of(2027, 12, 31),
                null,
                LocalDate.of(2026, 1, 15));

        // when
        ResultActions result = performPost("/api/transactions/recurring", request);

        // then
        result.andExpect(status().isBadRequest());
        Map<String, String> errors = validationErrors(result);
        assertThat(errors).containsKey("frequency");
    }

    @Test
    @DisplayName("POST /api/transactions/recurring - 401 when unauthenticated")
    void create_unauthenticated_returns401() throws Exception {
        performPost("/api/transactions/recurring", RecurringTransactionTestFixtures.createRequest(1L))
                .andExpect(status().isUnauthorized());
    }

    // --- GET /api/transactions/recurring ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/transactions/recurring - returns paginated list")
    void getAll() throws Exception {
        // given
        given(recurringTransactionService.getAll(any(), any())).willReturn(Page.empty());

        // when / then
        performGet("/api/transactions/recurring")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    // --- GET /api/transactions/recurring/{id} ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/transactions/recurring/{id} - returns recurring transaction by id")
    void getById() throws Exception {
        // given
        RecurringTransactionGetDTO dto = RecurringTransactionTestFixtures.getDTO(1L);
        given(recurringTransactionService.getById(1L)).willReturn(dto);

        // when
        ResultActions result = performGet("/api/transactions/recurring/{id}", 1L);

        // then
        result.andExpect(status().isOk());
        RecurringTransactionGetDTO body = fromJson(result, RecurringTransactionGetDTO.class);
        assertThat(body.id()).isEqualTo(1L);
        assertThat(body.title()).isEqualTo("Netflix");
    }

    // --- PATCH /api/transactions/recurring/{id} ---

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/transactions/recurring/{id} - updates recurring transaction")
    void update() throws Exception {
        // given
        RecurringTransactionPatchDTO request = new RecurringTransactionPatchDTO(
                "Updated Netflix", null, null, null, null, null, null, null, null, null, null, null, null, null);
        RecurringTransactionGetDTO updated = RecurringTransactionTestFixtures.getDTO(1L);
        given(recurringTransactionService.update(1L, request)).willReturn(updated);

        // when
        ResultActions result = performPatch("/api/transactions/recurring/{id}", request, 1L);

        // then
        result.andExpect(status().isOk());
    }

    // --- DELETE /api/transactions/recurring/{id} ---

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/transactions/recurring/{id} - deletes recurring transaction and returns 204")
    void delete() throws Exception {
        // given
        willDoNothing().given(recurringTransactionService).delete(1L);

        // when / then
        performDelete("/api/transactions/recurring/{id}", 1L).andExpect(status().isNoContent());
    }
}
