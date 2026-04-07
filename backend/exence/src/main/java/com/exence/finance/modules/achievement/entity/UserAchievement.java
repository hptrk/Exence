package com.exence.finance.modules.achievement.entity;

import com.exence.finance.modules.auth.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(
        name = "user_achievement",
        uniqueConstraints =
                @UniqueConstraint(
                        columnNames = {"user_id", "achievement_id"},
                        name = "uq_user_achievement"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_achievement_id_seq")
    @SequenceGenerator(name = "user_achievement_id_seq", sequenceName = "user_achievement_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    @CreationTimestamp
    @Column(name = "unlocked_at", nullable = false, updatable = false)
    private Instant unlockedAt;
}
