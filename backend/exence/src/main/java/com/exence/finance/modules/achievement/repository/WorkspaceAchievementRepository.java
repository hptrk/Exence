package com.exence.finance.modules.achievement.repository;

import com.exence.finance.modules.achievement.entity.WorkspaceAchievement;
import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceAchievementRepository extends JpaRepository<WorkspaceAchievement, Long> {

    @Query("SELECT wa FROM WorkspaceAchievement wa JOIN FETCH wa.achievement WHERE wa.workspace.id = :workspaceId")
    List<WorkspaceAchievement> findByWorkspaceId(Long workspaceId);

    @Query("SELECT wa.achievement.id FROM WorkspaceAchievement wa WHERE wa.workspace.id = :workspaceId")
    Set<Long> findUnlockedAchievementIdsByWorkspaceId(Long workspaceId);

    @Query("SELECT COUNT(wa) > 0 FROM WorkspaceAchievement wa "
            + "WHERE wa.workspace.id = :workspaceId "
            + "AND wa.achievement.type = :type "
            + "AND wa.achievement.tier = :tier")
    boolean existsByWorkspaceIdAndTypeAndTier(Long workspaceId, AchievementType type, AchievementTier tier);
}
