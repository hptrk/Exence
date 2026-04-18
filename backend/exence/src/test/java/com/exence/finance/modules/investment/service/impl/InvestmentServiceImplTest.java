package com.exence.finance.modules.investment.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.InvestmentTestFixtures;
import com.exence.finance.common.fixtures.WorkspaceTestFixtures;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.investment.entity.Investment;
import com.exence.finance.modules.investment.mapper.InvestmentMapper;
import com.exence.finance.modules.investment.repository.InvestmentRepository;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InvestmentServiceImplTest {

    @Mock
    private InvestmentRepository investmentRepository;

    @Mock
    private ExchangeRateService exchangeRateService;

    @Mock
    private InvestmentMapper investmentMapper;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @InjectMocks
    private InvestmentServiceImpl investmentService;

    @Test
    @DisplayName("returns all investments for workspace")
    void getInvestments() {
        // given
        Investment investment =
                InvestmentTestFixtures.bitcoinInvestment(1L, LocalDate.of(2026, 1, 15), new BigDecimal("0.5"));

        InvestmentGetDTO dto = InvestmentTestFixtures.getDTO();

        given(investmentRepository.findAllWorkspaceFiltered()).willReturn(List.of(investment));
        given(investmentMapper.mapToGetDTO(investment)).willReturn(dto);

        // when
        List<InvestmentGetDTO> result = investmentService.getInvestments();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.getFirst().asset()).isEqualTo("Bitcoin");
    }

    @Test
    @DisplayName("returns empty list when no investments exist")
    void getInvestments_empty() {
        // given
        given(investmentRepository.findAllWorkspaceFiltered()).willReturn(List.of());

        // when
        List<InvestmentGetDTO> result = investmentService.getInvestments();

        // then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("returns grouped investments by asset")
    void getGroupedInvestments() {
        // given
        Investment btc1 = InvestmentTestFixtures.bitcoinInvestment(
                1L, LocalDate.of(2026, 1, 15), new BigDecimal("0.5"), new BigDecimal("1250.00"));
        Investment btc2 = InvestmentTestFixtures.bitcoinInvestment(
                2L, LocalDate.of(2026, 2, 10), new BigDecimal("0.3"), new BigDecimal("750.00"));

        InvestmentGetDTO dto1 = InvestmentTestFixtures.getDTO();
        InvestmentGetDTO dto2 = InvestmentTestFixtures.getDTO(
                2L, LocalDate.of(2026, 2, 10), new BigDecimal("0.3"), new BigDecimal("750.00"));

        given(investmentRepository.findAllWorkspaceFiltered()).willReturn(List.of(btc1, btc2));
        given(investmentMapper.mapToGetDTO(btc1)).willReturn(dto1);
        given(investmentMapper.mapToGetDTO(btc2)).willReturn(dto2);

        // when
        var result = investmentService.getGroupedInvestments();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Bitcoin");
        assertThat(result.get(0).purchasesCount()).isEqualTo(2);
        assertThat(result.get(0).totalInvested()).isEqualByComparingTo(new BigDecimal("2000.00"));
    }

    @Test
    @DisplayName("creates investment with base currency conversion")
    void createInvestment() {
        // given
        InvestmentCreateDTO request = InvestmentTestFixtures.createRequest();
        Investment investment = InvestmentTestFixtures.createMappedInvestment();

        Workspace workspace = WorkspaceTestFixtures.defaultWorkspace();
        InvestmentGetDTO response = InvestmentTestFixtures.getDTO();

        given(investmentMapper.mapFromCreateDTO(request)).willReturn(investment);
        given(workspaceMembershipService.getWorkspaceReference()).willReturn(workspace);
        given(exchangeRateService.calculateBaseCurrencyAmount(
                        request.amount(), request.currency(), request.purchaseDate()))
                .willReturn(new BigDecimal("1250.00"));
        given(investmentRepository.save(investment)).willReturn(investment);
        given(investmentMapper.mapToGetDTO(investment)).willReturn(response);

        // when
        InvestmentGetDTO result = investmentService.createInvestment(request);

        // then
        assertThat(result.asset()).isEqualTo("Bitcoin");
        assertThat(result.baseCurrencyAmount()).isEqualByComparingTo(new BigDecimal("1250.00"));
        then(investmentRepository).should().save(investment);
    }

    @Test
    @DisplayName("patches investment and recalculates base currency")
    void patchInvestment() {
        // given
        Long investmentId = 1L;
        InvestmentPatchDTO patch = InvestmentTestFixtures.patchRequest();
        Investment investment = InvestmentTestFixtures.bitcoinInvestment(
                investmentId, LocalDate.of(2026, 1, 15), new BigDecimal("500000.00"), new BigDecimal("1250.00"));

        InvestmentGetDTO response = InvestmentTestFixtures.getDTO();

        given(investmentRepository.find(investmentId)).willReturn(Optional.of(investment));
        given(exchangeRateService.calculateBaseCurrencyAmount(any(), any(), any()))
                .willReturn(new BigDecimal("1875.00"));
        given(investmentRepository.save(investment)).willReturn(investment);
        given(investmentMapper.mapToGetDTO(investment)).willReturn(response);

        // when
        InvestmentGetDTO result = investmentService.patchInvestment(investmentId, patch);

        // then
        assertThat(result).isNotNull();
        then(investmentRepository).should().save(investment);
    }

    @Test
    @DisplayName("throws INVESTMENT_NOT_FOUND when investment does not exist")
    void patchInvestment_notFound() {
        // given
        Long investmentId = 999L;
        InvestmentPatchDTO patch = InvestmentTestFixtures.patchRequest();

        given(investmentRepository.find(investmentId)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> investmentService.patchInvestment(investmentId, patch))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVESTMENT_NOT_FOUND);

        then(investmentRepository).should(never()).save(any());
    }

    @Test
    @DisplayName("deletes investment when it exists")
    void deleteInvestment() {
        // given
        Long investmentId = 1L;
        Investment investment = InvestmentTestFixtures.minimalInvestment(investmentId);

        given(investmentRepository.find(investmentId)).willReturn(Optional.of(investment));

        // when
        investmentService.deleteInvestment(investmentId);

        // then
        then(investmentRepository).should().delete(investment);
    }

    @Test
    @DisplayName("throws INVESTMENT_NOT_FOUND when deleting non-existent investment")
    void deleteInvestment_notFound() {
        // given
        Long investmentId = 999L;
        given(investmentRepository.find(investmentId)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> investmentService.deleteInvestment(investmentId))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVESTMENT_NOT_FOUND);

        then(investmentRepository).should(never()).delete(any());
    }
}
