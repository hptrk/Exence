package com.exence.finance.modules.achievement.checker.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.modules.achievement.checker.AchievementChecker;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.debt.repository.DebtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DebtCountChecker implements AchievementChecker {

    private final DebtRepository debtRepository;

    @Override
    public AchievementType getSupportedType() {
        return AchievementType.DEBT_COUNT;
    }

    @Override
    @ReadTransactional
    public long computeCurrentValue(Long workspaceId) {
        return debtRepository.countAllByWorkspaceId(workspaceId);
    }
}
