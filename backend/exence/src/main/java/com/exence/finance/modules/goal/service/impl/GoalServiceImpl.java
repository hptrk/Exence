package com.exence.finance.modules.goal.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.category.service.CategoryService;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.entity.GoalProgressHistory;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.event.GoalCompletedEvent;
import com.exence.finance.modules.goal.event.GoalCreatedEvent;
import com.exence.finance.modules.goal.mapper.GoalMapper;
import com.exence.finance.modules.goal.repository.GoalProgressRepository;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.goal.service.GoalService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final GoalProgressRepository goalProgressRepository;
    private final CategoryService categoryService;
    private final ExchangeRateService exchangeRateService;
    private final GoalMapper goalMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final WorkspaceMembershipService workspaceMembershipService;

    @ReadTransactional
    public Goal getGoal(Long id) {
        return goalRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.GOAL_NOT_FOUND));
    }

    @ReadTransactional
    public List<GoalGetDTO> getGoalsByStatuses(List<GoalStatus> statuses) {
        List<Goal> goals = statuses == null || statuses.isEmpty()
                ? goalRepository.findAllWorkspaceFiltered()
                : goalRepository.findByStatusIn(statuses);
        return goals.stream().map(goalMapper::mapToGetDTO).toList();
    }

    @ReadTransactional
    public GoalGetDTO getGoalById(Long id) {
        return goalMapper.mapToGetDTO(getGoal(id));
    }

    @WriteTransactional
    public GoalGetDTO createGoal(GoalCreateDTO dto) {
        Goal goal = goalMapper.mapFromCreateDTO(dto);
        goal.setWorkspace(workspaceMembershipService.getWorkspaceReference());
        goal.setCategory(categoryService.getCategory(dto.categoryId()));

        BigDecimal initialAmount = dto.initialAmount() != null ? dto.initialAmount() : BigDecimal.ZERO;
        goal.setCurrentAmount(initialAmount);

        BigDecimal targetBaseCurrencyAmount =
                exchangeRateService.calculateBaseCurrencyAmount(dto.targetAmount(), dto.currency(), LocalDate.now());
        BigDecimal currentBaseCurrencyAmount =
                exchangeRateService.calculateBaseCurrencyAmount(initialAmount, dto.currency(), LocalDate.now());
        goal.setTargetBaseCurrencyAmount(targetBaseCurrencyAmount);
        goal.setCurrentBaseCurrencyAmount(currentBaseCurrencyAmount);

        GoalStatus status = initialAmount.compareTo(dto.targetAmount()) >= 0 ? GoalStatus.COMPLETED : GoalStatus.ACTIVE;
        goal.setStatus(status);

        Goal savedGoal = goalRepository.save(goal);
        recordProgress(savedGoal, initialAmount);

        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        eventPublisher.publishEvent(new GoalCreatedEvent(workspaceId));
        if (status == GoalStatus.COMPLETED) {
            eventPublisher.publishEvent(new GoalCompletedEvent(workspaceId));
        }

        return goalMapper.mapToGetDTO(savedGoal);
    }

    @WriteTransactional
    public GoalGetDTO patchGoal(Long id, GoalPatchDTO dto) {
        Goal goal = getGoal(id);
        GoalStatus previousStatus = goal.getStatus();
        SupportedCurrency currency = goal.getCurrency();

        if (dto.targetAmount() != null && !dto.targetAmount().equals(goal.getTargetAmount())) {
            goal.setTargetAmount(dto.targetAmount());
            goal.setTargetBaseCurrencyAmount(
                    exchangeRateService.calculateBaseCurrencyAmount(dto.targetAmount(), currency, LocalDate.now()));
        }

        boolean progressChanged =
                dto.currentAmount() != null && !dto.currentAmount().equals(goal.getCurrentAmount());
        if (progressChanged) {
            goal.setCurrentAmount(dto.currentAmount());
            goal.setCurrentBaseCurrencyAmount(
                    exchangeRateService.calculateBaseCurrencyAmount(dto.currentAmount(), currency, LocalDate.now()));
            recordProgress(goal, dto.currentAmount());
        }

        if (dto.status() != null) {
            goal.setStatus(dto.status());
        } else if (progressChanged && goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(GoalStatus.COMPLETED);
        }

        if (dto.categoryId() != null
                && !dto.categoryId().equals(goal.getCategory().getId())) {
            goal.setCategory(categoryService.getCategory(dto.categoryId()));
        }

        goalMapper.updateGoalFromPatchDTO(dto, goal);
        Goal savedGoal = goalRepository.save(goal);

        if (savedGoal.getStatus() == GoalStatus.COMPLETED && previousStatus != GoalStatus.COMPLETED) {
            eventPublisher.publishEvent(new GoalCompletedEvent(WorkspaceContextHolder.getWorkspaceId()));
        }

        return goalMapper.mapToGetDTO(savedGoal);
    }

    @WriteTransactional
    public void deleteGoal(Long id) {
        Goal goal = getGoal(id);
        goalRepository.delete(goal);
    }

    @WriteTransactional
    public int expireOverdueGoals() {
        return goalRepository.expireOverdueGoals(
                GoalStatus.EXPIRED, LocalDate.now(), List.of(GoalStatus.ACTIVE, GoalStatus.PAUSED));
    }

    private void recordProgress(Goal goal, BigDecimal amount) {
        GoalProgressHistory history =
                GoalProgressHistory.builder().goal(goal).amount(amount).build();
        goalProgressRepository.save(history);
    }
}
