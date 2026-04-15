package com.exence.finance.modules.auditlog.dto;

import com.exence.finance.modules.auditlog.enums.ChangeType;
import java.time.Instant;
import java.util.List;

public record AuditLogDTO(
        String entityType,
        String entityId,
        ChangeType action,
        Instant changedAt,
        String changedBy,
        List<AuditLogChangeDTO> changes) {}
