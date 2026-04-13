package com.exence.finance.modules.workspace.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.transaction.event.BaseCurrencyChangedEvent;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsGetDTO;
import com.exence.finance.modules.workspace.dto.WorkspaceSettingsPatchRequest;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.entity.WorkspaceSettings;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.mapper.WorkspaceSettingsMapper;
import com.exence.finance.modules.workspace.repository.WorkspaceSettingsRepository;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import com.exence.finance.modules.workspace.service.WorkspaceSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkspaceSettingsServiceImpl implements WorkspaceSettingsService {

    private final WorkspaceSettingsRepository workspaceSettingsRepository;
    private final WorkspaceSettingsMapper workspaceSettingsMapper;
    private final WorkspaceMembershipService workspaceMembershipService;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @ReadTransactional
    public WorkspaceSettingsGetDTO getWorkspaceSettings() {
        return workspaceSettingsMapper.toGetDTO(getCurrentSettings());
    }

    @Override
    @WriteTransactional
    public WorkspaceSettingsGetDTO updateWorkspaceSettings(WorkspaceSettingsPatchRequest request) {
        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        Long userId = userService.getCurrentUserId();
        WorkspaceMember member = workspaceMembershipService.getWorkspaceMember(workspaceId, userId);

        if (member.getRole() != WorkspaceRole.OWNER) {
            throw new ExenceException(ErrorCode.WORKSPACE_OWNER_REQUIRED);
        }

        WorkspaceSettings settings = getCurrentSettings();

        SupportedCurrency oldBaseCurrency = settings.getBaseCurrency();
        SupportedCurrency newBaseCurrency = request.baseCurrency();

        if (newBaseCurrency != null && newBaseCurrency != oldBaseCurrency) {
            log.info("Base currency changed from {} to {} for user {}", oldBaseCurrency, newBaseCurrency, userId);
            // publish event instead of circular transactionService dependency
            eventPublisher.publishEvent(new BaseCurrencyChangedEvent(newBaseCurrency));
        }

        workspaceSettingsMapper.updateFromRequest(request, settings);
        settings = workspaceSettingsRepository.save(settings);
        return workspaceSettingsMapper.toGetDTO(settings);
    }

    private WorkspaceSettings getCurrentSettings() {
        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        return workspaceSettingsRepository
                .findByWorkspaceId(workspaceId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for workspace " + workspaceId));
    }
}
