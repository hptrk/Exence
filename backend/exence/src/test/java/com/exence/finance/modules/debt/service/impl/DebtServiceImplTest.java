package com.exence.finance.modules.debt.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.CategoryTestFixtures;
import com.exence.finance.common.fixtures.DebtTestFixtures;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.entity.Debt;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.debt.event.DebtSettledEvent;
import com.exence.finance.modules.debt.mapper.DebtMapper;
import com.exence.finance.modules.debt.repository.DebtRepository;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

@ExtendWith(MockitoExtension.class)
class DebtServiceImplTest {

    @Mock
    private DebtRepository debtRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ExchangeRateService exchangeRateService;

    @Mock
    private DebtMapper debtMapper;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @InjectMocks
    private DebtServiceImpl debtService;

    @Test
    @DisplayName("throws DEBT_PAYMENT_EXCEEDS_REMAINING when payment amount is too large")
    void pay_exceedsRemaining() {
        // given
        Debt debt = DebtTestFixtures.activeBorrowedDebt(new BigDecimal("100.00"));
        given(debtRepository.find(1L)).willReturn(Optional.of(debt));

        // when / then
        assertThatThrownBy(() -> debtService.makePayment(1L, new DebtPaymentDTO(new BigDecimal("150.00"))))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DEBT_PAYMENT_EXCEEDS_REMAINING);
    }

    @Test
    @DisplayName("sets status to SETTLED when payment equals remaining amount")
    void pay_equalsRemaining() {
        // given
        Debt debt = DebtTestFixtures.activeBorrowedDebt(new BigDecimal("100.00"));
        BigDecimal paymentBase = new BigDecimal("100.00");
        DebtGetDTO responseDto = mockGetDto();

        given(debtRepository.find(1L)).willReturn(Optional.of(debt));
        given(exchangeRateService.calculateBaseCurrencyAmount(any(), eq(SupportedCurrency.EUR), any(LocalDate.class)))
                .willReturn(paymentBase);
        given(debtRepository.save(debt)).willReturn(debt);
        given(debtMapper.mapToGetDTO(debt)).willReturn(responseDto);

        // when
        debtService.makePayment(1L, new DebtPaymentDTO(new BigDecimal("100.00")));

        // then
        assertThat(debt.getStatus()).isEqualTo(DebtStatus.SETTLED);
        assertThat(debt.getRemainingAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        then(eventPublisher).should().publishEvent(any(DebtSettledEvent.class));
    }

    @Test
    @DisplayName("reduces remaining amount without settling for partial payment")
    void pay_partial() {
        // given
        Debt debt = DebtTestFixtures.activeBorrowedDebt(new BigDecimal("100.00"));
        BigDecimal paymentBase = new BigDecimal("30.00");
        DebtGetDTO responseDto = mockGetDto();

        given(debtRepository.find(1L)).willReturn(Optional.of(debt));
        given(exchangeRateService.calculateBaseCurrencyAmount(any(), eq(SupportedCurrency.EUR), any(LocalDate.class)))
                .willReturn(paymentBase);
        given(debtRepository.save(debt)).willReturn(debt);
        given(debtMapper.mapToGetDTO(debt)).willReturn(responseDto);

        // when
        debtService.makePayment(1L, new DebtPaymentDTO(new BigDecimal("30.00")));

        // then
        assertThat(debt.getStatus()).isEqualTo(DebtStatus.ACTIVE);
        assertThat(debt.getRemainingAmount()).isEqualByComparingTo(new BigDecimal("70.00"));
        then(eventPublisher).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("throws DEBT_NOT_FOUND when debt does not exist")
    void pay_notFound() {
        // given
        given(debtRepository.find(99L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> debtService.makePayment(99L, new DebtPaymentDTO(new BigDecimal("10.00"))))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DEBT_NOT_FOUND);
    }

    @Test
    @DisplayName("calculates and sets base currency amount from exchange rate")
    void create_foreignCurrency() {
        // given
        DebtCreateDTO dto = new DebtCreateDTO(
                "Loan", "John", new BigDecimal("500.00"), SupportedCurrency.USD, null, DebtType.BORROWED, 1L);
        Debt mappedDebt = DebtTestFixtures.activeBorrowedDebtInCurrency(
                SupportedCurrency.USD, new BigDecimal("500.00"), new BigDecimal("500.00"), new BigDecimal("460.00"));
        BigDecimal convertedAmount = new BigDecimal("460.00");
        DebtGetDTO responseDto = mockGetDto();

        given(debtMapper.mapFromCreateDTO(dto)).willReturn(mappedDebt);
        given(categoryService.getCategory(dto.categoryId())).willReturn(CategoryTestFixtures.expenseCategory());
        given(workspaceMembershipService.getWorkspaceReference())
                .willReturn(Workspace.builder().id(1L).build());
        given(exchangeRateService.calculateBaseCurrencyAmount(
                        eq(dto.originalAmount()), eq(SupportedCurrency.USD), any(LocalDate.class)))
                .willReturn(convertedAmount);
        given(debtRepository.save(mappedDebt)).willReturn(mappedDebt);
        given(debtMapper.mapToGetDTO(mappedDebt)).willReturn(responseDto);

        // when
        debtService.createDebt(dto);

        // then
        assertThat(mappedDebt.getOriginalBaseCurrencyAmount()).isEqualByComparingTo(convertedAmount);
        assertThat(mappedDebt.getRemainingBaseCurrencyAmount()).isEqualByComparingTo(convertedAmount);
    }

    private DebtGetDTO mockGetDto() {
        return new DebtGetDTO(
                1L,
                "Test Debt",
                "Alice",
                new BigDecimal("100.00"),
                BigDecimal.ZERO,
                new BigDecimal("100.00"),
                BigDecimal.ZERO,
                SupportedCurrency.EUR,
                null,
                DebtType.BORROWED,
                DebtStatus.SETTLED,
                1L,
                null);
    }
}
