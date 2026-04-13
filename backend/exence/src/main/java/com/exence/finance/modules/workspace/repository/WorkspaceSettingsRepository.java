package com.exence.finance.modules.workspace.repository;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.workspace.entity.WorkspaceSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceSettingsRepository extends JpaRepository<WorkspaceSettings, Long> {

    Optional<WorkspaceSettings> findByWorkspaceId(Long workspaceId);

    @Query("SELECT ws.baseCurrency FROM WorkspaceSettings ws WHERE ws.workspace.id = :workspaceId")
    Optional<SupportedCurrency> findBaseCurrencyByWorkspaceId(@Param("workspaceId") Long workspaceId);
}
