package com.exence.finance.modules.workspace.repository;

import com.exence.finance.modules.workspace.entity.Workspace;
import java.util.List;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
@JaversSpringDataAuditable
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    @Query("SELECT w FROM Workspace w JOIN w.members m WHERE m.user.id = :userId")
    List<Workspace> findAllByUserId(@Param("userId") Long userId);
}
