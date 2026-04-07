package com.exence.finance.modules.achievement.checker.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.modules.achievement.checker.AchievementChecker;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionCountChecker implements AchievementChecker {

    private final TransactionRepository transactionRepository;

    @Override
    public AchievementType getSupportedType() {
        return AchievementType.TRANSACTION_COUNT;
    }

    @Override
    @ReadTransactional
    public long computeCurrentValue(Long userId) {
        return transactionRepository.countByUserId(userId);
    }
}
