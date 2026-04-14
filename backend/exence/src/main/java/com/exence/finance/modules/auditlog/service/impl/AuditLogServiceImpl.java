package com.exence.finance.modules.auditlog.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogFilter;
import com.exence.finance.modules.auditlog.enums.ChangeType;
import com.exence.finance.modules.auditlog.mapper.AuditLogMapper;
import com.exence.finance.modules.auditlog.service.AuditLogService;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.entity.WorkspaceMember;
import com.exence.finance.modules.workspace.enums.WorkspaceRole;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.javers.core.Changes;
import org.javers.core.Javers;
import org.javers.core.metamodel.object.SnapshotType;
import org.javers.repository.jql.QueryBuilder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final Javers javers;
    private final UserService userService;
    private final WorkspaceMembershipService workspaceMembershipService;
    private final AuditLogMapper auditLogMapper;

    @Override
    @ReadTransactional
    public Slice<AuditLogDTO> getWorkspaceAuditLogs(AuditLogFilter filter, Pageable pageable) {
        Long userId = userService.getCurrentUserId();
        Long workspaceId = WorkspaceContextHolder.getWorkspaceId();
        WorkspaceMember member = workspaceMembershipService.getWorkspaceMember(workspaceId, userId);
        if (member.getRole() != WorkspaceRole.OWNER) {
            throw new ExenceException(ErrorCode.WORKSPACE_OWNER_REQUIRED);
        }
        return querySlice(filter, workspaceId, pageable);
    }

    @Override
    @ReadTransactional
    public Slice<AuditLogDTO> getAllAuditLogs(AuditLogFilter filter, Pageable pageable) {
        return querySlice(filter, null, pageable);
    }

    private Slice<AuditLogDTO> querySlice(AuditLogFilter filter, Long workspaceId, Pageable pageable) {
        QueryBuilder qb = buildQueryBuilder(filter, workspaceId)
                .limit(pageable.getPageSize() + 1)
                .skip((int) pageable.getOffset());

        Changes changes = javers.findChanges(qb.build());

        List<AuditLogDTO> all = changes.stream()
                .filter(c -> c.getCommitMetadata().isPresent())
                .collect(Collectors.groupingBy(
                        c -> c.getCommitMetadata().get().getId().value()
                                + "_"
                                + c.getAffectedGlobalId().toString()))
                .values().stream()
                .map(auditLogMapper::toAuditLogDTO)
                .sorted(Comparator.comparing(AuditLogDTO::changedAt).reversed())
                .collect(Collectors.toList());

        boolean hasNext = all.size() > pageable.getPageSize();
        List<AuditLogDTO> content = hasNext ? all.subList(0, pageable.getPageSize()) : all;
        return new SliceImpl<>(content, pageable, hasNext);
    }

    private QueryBuilder buildQueryBuilder(AuditLogFilter filter, Long workspaceId) {
        QueryBuilder qb;
        if (filter.entityType() != null) {
            qb = QueryBuilder.byClass(filter.entityType().getEntityClass());
        } else {
            qb = QueryBuilder.anyDomainObject();
        }

        if (workspaceId != null) {
            qb = qb.withCommitProperty("workspaceId", workspaceId.toString());
        }

        if (filter.changedBy() != null && !filter.changedBy().isBlank()) {
            qb = qb.byAuthor(filter.changedBy());
        }

        if (filter.from() != null) {
            qb = qb.from(LocalDateTime.of(filter.from(), LocalTime.MIDNIGHT));
        }

        if (filter.to() != null) {
            qb = qb.to(LocalDateTime.of(filter.to(), LocalTime.MAX));
        }

        if (filter.changeType() != null) {
            qb = qb.withSnapshotType(toSnapshotType(filter.changeType()));
        }

        return qb;
    }

    private SnapshotType toSnapshotType(ChangeType changeType) {
        return switch (changeType) {
            case CREATED -> SnapshotType.INITIAL;
            case UPDATED -> SnapshotType.UPDATE;
            case DELETED -> SnapshotType.TERMINAL;
        };
    }

}
