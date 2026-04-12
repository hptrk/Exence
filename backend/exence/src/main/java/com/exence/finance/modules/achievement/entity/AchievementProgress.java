package com.exence.finance.modules.achievement.entity;

import static com.exence.finance.common.util.ValidationConstants.ACHIEVEMENT_TYPE_MAX_LENGTH;

import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.workspace.entity.Workspace;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "achievement_progress",
        uniqueConstraints =
                @UniqueConstraint(
                        columnNames = {"workspace_id", "achievement_type"},
                        name = "uq_achievement_progress_workspace_type"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "achievement_progress_id_seq")
    @SequenceGenerator(
            name = "achievement_progress_id_seq",
            sequenceName = "achievement_progress_id_seq",
            allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Enumerated(EnumType.STRING)
    @Column(name = "achievement_type", nullable = false, length = ACHIEVEMENT_TYPE_MAX_LENGTH)
    private AchievementType achievementType;

    @Column(name = "current_value", nullable = false)
    private Long currentValue;
}
