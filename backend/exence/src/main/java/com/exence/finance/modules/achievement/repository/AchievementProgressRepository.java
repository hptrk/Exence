package com.exence.finance.modules.achievement.repository;

import com.exence.finance.modules.achievement.dto.projection.ProgressProjection;
import com.exence.finance.modules.achievement.entity.AchievementProgress;
import com.exence.finance.modules.achievement.enums.AchievementType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementProgressRepository extends JpaRepository<AchievementProgress, Long> {

    @Query("SELECT ap FROM AchievementProgress ap WHERE ap.user.id = :userId AND ap.achievementType = :type")
    Optional<AchievementProgress> findByUserIdAndType(Long userId, AchievementType type);

    @Query("SELECT " + "new com.exence.finance.modules.achievement.dto.projection.ProgressProjection("
            + "ap.achievementType, ap.currentValue"
            + ") "
            + "FROM AchievementProgress ap WHERE ap.user.id = :userId")
    List<ProgressProjection> findAllByUserId(Long userId);
}
