package com.exence.finance.modules.achievement.repository;

import com.exence.finance.modules.achievement.entity.Achievement;
import com.exence.finance.modules.achievement.enums.AchievementType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    @Query("SELECT a FROM Achievement a WHERE a.type = :type AND a.requirementValue <= :currentValue")
    List<Achievement> findQualifiedByType(AchievementType type, long currentValue);
}
