package com.exence.finance.modules.achievement.entity;

import static com.exence.finance.common.util.ValidationConstants.ACHIEVEMENT_DESCRIPTION_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.ACHIEVEMENT_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.ACHIEVEMENT_TYPE_MAX_LENGTH;

import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "achievement")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "achievement_id_seq")
    @SequenceGenerator(name = "achievement_id_seq", sequenceName = "achievement_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, length = ACHIEVEMENT_NAME_MAX_LENGTH)
    private String name;

    @Column(name = "description", nullable = false, length = ACHIEVEMENT_DESCRIPTION_MAX_LENGTH)
    private String description;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "tier", nullable = false, columnDefinition = "achievement_tier")
    private AchievementTier tier;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = ACHIEVEMENT_TYPE_MAX_LENGTH)
    private AchievementType type;

    @Column(name = "requirement_value", nullable = false)
    private Long requirementValue;
}
