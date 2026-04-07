package com.exence.finance.modules.achievement.repository;

import com.exence.finance.modules.achievement.entity.UserAchievement;
import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    @Query("SELECT ua FROM UserAchievement ua JOIN FETCH ua.achievement WHERE ua.user.id = :userId")
    List<UserAchievement> findByUserId(Long userId);

    @Query("SELECT ua.achievement.id FROM UserAchievement ua WHERE ua.user.id = :userId")
    Set<Long> findUnlockedAchievementIdsByUserId(Long userId);

    @Query("SELECT COUNT(ua) > 0 FROM UserAchievement ua WHERE ua.user.id = :userId AND ua.achievement.type = :type AND ua.achievement.tier = :tier")
    boolean existsByUserIdAndTypeAndTier(Long userId, AchievementType type, AchievementTier tier);
}
