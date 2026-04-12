package com.exence.finance.modules.achievement.checker.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.modules.achievement.checker.AchievementChecker;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AppStreakChecker implements AchievementChecker {

    private final TransactionRepository transactionRepository;

    @Override
    public AchievementType getSupportedType() {
        return AchievementType.APP_STREAK;
    }

    @Override
    @ReadTransactional
    public long computeCurrentValue(Long workspaceId) {
        // TODO: make it weekly streak
        List<LocalDate> dates = transactionRepository.findDistinctCreatedAtByWorkspaceId(workspaceId).stream()
                .map(Date::toLocalDate)
                .toList();
        if (dates.isEmpty()) {
            return 0;
        }
        long maxStreak = 1;
        long currentStreak = 1;
        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i).equals(dates.get(i - 1).plusDays(1))) {
                currentStreak++;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                currentStreak = 1;
            }
        }
        return maxStreak;
    }
}
