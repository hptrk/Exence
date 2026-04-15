package com.exence.finance.modules.auditlog.dto;

import com.exence.finance.modules.auditlog.enums.AuditableEntityType;
import com.exence.finance.modules.auditlog.enums.ChangeType;
import java.time.LocalDate;

public record AuditLogFilter(
        AuditableEntityType entityType, LocalDate from, LocalDate to, ChangeType changeType, String changedBy) {}
