package com.exence.finance.modules.workspace.repository;

import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {

    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    @Query("SELECT COUNT(wm) FROM WorkspaceMember wm WHERE wm.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    boolean existsByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    @Query(
            """
            SELECT wm FROM WorkspaceMember wm
            WHERE wm.workspace.id = :workspaceId AND wm.user.email = :email
            """)
    Optional<WorkspaceMember> findByWorkspaceIdAndUserEmail(
            @Param("workspaceId") Long workspaceId, @Param("email") String email);

    List<WorkspaceMember> findAllByWorkspaceId(Long workspaceId);
}
