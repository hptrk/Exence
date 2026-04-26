package com.exence.finance.modules.goal.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.verify;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.fixtures.CategoryTestFixtures;
import com.exence.finance.common.fixtures.GoalTestFixtures;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.mapper.GoalMapper;
import com.exence.finance.modules.goal.repository.GoalProgressRepository;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.entity.Workspace;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

@ExtendWith(MockitoExtension.class)
class GoalServiceImplTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private GoalProgressRepository goalProgressRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ExchangeRateService exchangeRateService;

    @Mock
    private GoalMapper goalMapper;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private WorkspaceMembershipService workspaceMembershipService;

    @InjectMocks
    private GoalServiceImpl goalService;

    @BeforeEach
    void setWorkspaceContext() {
        WorkspaceContextHolder.setWorkspaceId(1L);
    }

    @AfterEach
    void clearWorkspaceContext() {
        WorkspaceContextHolder.clear();
    }

    @Test
    @DisplayName("sets status to ACTIVE when initial amount is below target")
    void create_amountBelowTarget() {
        // given
        GoalCreateDTO dto = GoalTestFixtures.goalCreateDto(new BigDecimal("100.00"), new BigDecimal("10.00"));
        Goal mappedGoal = GoalTestFixtures.mappedGoal(dto);

        given(goalMapper.mapFromCreateDTO(dto)).willReturn(mappedGoal);
        given(categoryService.getCategory(dto.categoryId())).willReturn(CategoryTestFixtures.expenseCategory());
        given(workspaceMembershipService.getWorkspaceReference())
                .willReturn(Workspace.builder().id(1L).build());
        given(exchangeRateService.calculateBaseCurrencyAmount(any(BigDecimal.class), any(), any(LocalDate.class)))
                .willReturn(new BigDecimal("100.00"), new BigDecimal("10.00"));
        given(goalRepository.save(any(Goal.class))).willReturn(mappedGoal);
        given(goalProgressRepository.save(any())).willReturn(null);
        given(goalMapper.mapToGetDTO(mappedGoal)).willReturn(mockGetDto());

        // when
        goalService.createGoal(dto);

        // then
        assertThat(mappedGoal.getStatus()).isEqualTo(GoalStatus.ACTIVE);
    }

    @Test
    @DisplayName("sets status to COMPLETED when initial amount reaches target")
    void create_amountReachesTarget() {
        // given
        GoalCreateDTO dto = GoalTestFixtures.goalCreateDto(new BigDecimal("100.00"), new BigDecimal("100.00"));
        Goal mappedGoal = GoalTestFixtures.mappedGoal(dto);

        given(goalMapper.mapFromCreateDTO(dto)).willReturn(mappedGoal);
        given(categoryService.getCategory(dto.categoryId())).willReturn(CategoryTestFixtures.expenseCategory());
        given(workspaceMembershipService.getWorkspaceReference())
                .willReturn(Workspace.builder().id(1L).build());
        given(exchangeRateService.calculateBaseCurrencyAmount(any(BigDecimal.class), any(), any(LocalDate.class)))
                .willReturn(new BigDecimal("100.00"), new BigDecimal("100.00"));
        given(goalRepository.save(any(Goal.class))).willReturn(mappedGoal);
        given(goalProgressRepository.save(any())).willReturn(null);
        given(goalMapper.mapToGetDTO(mappedGoal)).willReturn(mockGetDto());

        // when
        goalService.createGoal(dto);

        // then
        assertThat(mappedGoal.getStatus()).isEqualTo(GoalStatus.COMPLETED);
        verify(eventPublisher, atLeast(2)).publishEvent((Object) any());
    }

    @Test
    @DisplayName("converts target and current amounts to base currency")
    void create_foreignCurrency() {
        // given
        GoalCreateDTO dto = GoalTestFixtures.goalCreateDto(new BigDecimal("100.00"), new BigDecimal("10.00"));
        Goal mappedGoal = GoalTestFixtures.mappedGoal(dto);
        BigDecimal convertedTarget = new BigDecimal("38000.00");
        BigDecimal convertedCurrent = new BigDecimal("3800.00");

        given(goalMapper.mapFromCreateDTO(dto)).willReturn(mappedGoal);
        given(categoryService.getCategory(dto.categoryId())).willReturn(CategoryTestFixtures.expenseCategory());
        given(workspaceMembershipService.getWorkspaceReference())
                .willReturn(Workspace.builder().id(1L).build());
        given(exchangeRateService.calculateBaseCurrencyAmount(any(BigDecimal.class), any(), any(LocalDate.class)))
                .willReturn(convertedTarget, convertedCurrent);
        given(goalRepository.save(any(Goal.class))).willReturn(mappedGoal);
        given(goalProgressRepository.save(any())).willReturn(null);
        given(goalMapper.mapToGetDTO(mappedGoal)).willReturn(mockGetDto());

        // when
        goalService.createGoal(dto);

        // then
        assertThat(mappedGoal.getTargetBaseCurrencyAmount()).isEqualByComparingTo(convertedTarget);
        assertThat(mappedGoal.getCurrentBaseCurrencyAmount()).isEqualByComparingTo(convertedCurrent);
    }

    @Test
    @DisplayName("saves progress history entry when current amount is patched")
    void patch_progressChanged() {
        // given
        Goal goal = GoalTestFixtures.activeGoal(new BigDecimal("500.00"), new BigDecimal("100.00"));
        GoalPatchDTO dto = new GoalPatchDTO(null, null, null, new BigDecimal("200.00"), null, null, null);

        given(goalRepository.find(1L)).willReturn(Optional.of(goal));
        given(exchangeRateService.calculateBaseCurrencyAmount(any(BigDecimal.class), any(), any(LocalDate.class)))
                .willReturn(new BigDecimal("200.00"));
        given(goalRepository.save(any(Goal.class))).willReturn(goal);
        given(goalProgressRepository.save(any())).willReturn(null);
        given(goalMapper.mapToGetDTO(goal)).willReturn(mockGetDto());

        // when
        goalService.patchGoal(1L, dto);

        // then
        then(goalProgressRepository).should().save(any());
    }

    @Test
    @DisplayName("sets status to EXPIRED for overdue goals")
    void expireOverdue_hasDue() {
        // given
        given(goalRepository.expireOverdueGoals(eq(GoalStatus.EXPIRED), any(LocalDate.class), any()))
                .willReturn(3);

        // when
        int result = goalService.expireOverdueGoals();

        // then
        assertThat(result).isEqualTo(3);
    }

    private GoalGetDTO mockGetDto() {
        return new GoalGetDTO(
                1L,
                "Savings goal",
                null,
                new BigDecimal("100.00"),
                new BigDecimal("10.00"),
                new BigDecimal("100.00"),
                new BigDecimal("10.00"),
                SupportedCurrency.EUR,
                null,
                GoalStatus.ACTIVE,
                1L,
                null);
    }
}
