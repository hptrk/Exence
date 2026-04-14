package com.exence.finance.modules.workspace.entity;

import static com.exence.finance.common.util.ValidationConstants.ROLE_MAX_LENGTH;

import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
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
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.javers.core.metamodel.annotation.DiffIgnore;

@Entity
@Table(
        name = "workspace_member",
        uniqueConstraints =
                @UniqueConstraint(
                        columnNames = {"workspace_id", "user_id"},
                        name = "uq_workspace_member"))
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"workspace", "user"})
@ToString(exclude = {"workspace", "user"})
public class WorkspaceMember {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "workspace_member_id_seq")
    @SequenceGenerator(name = "workspace_member_id_seq", sequenceName = "workspace_member_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @DiffIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @DiffIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "role", nullable = false, length = ROLE_MAX_LENGTH)
    private WorkspaceRole role;

    @DiffIgnore
    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;
}
