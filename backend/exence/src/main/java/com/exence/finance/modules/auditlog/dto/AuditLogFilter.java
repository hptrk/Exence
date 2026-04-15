package com.exence.finance.modules.auditlog.dto;

import com.exence.finance.modules.auditlog.enums.AuditableEntityType;
import com.exence.finance.modules.auditlog.enums.ChangeType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(title = "Audit Log Filter", description = "Used for filtering audit log entries based on various criteria.")
public record AuditLogFilter(
        @Schema(description = "Type of the entity to filter by.", example = "TRANSACTION")
                AuditableEntityType entityType,
        @Schema(description = "Start date for filtering audit log entries (inclusive).", example = "2026-01-01")
                LocalDate from,
        @Schema(description = "End date for filtering audit log entries (inclusive).", example = "2026-12-31")
                LocalDate to,
        @Schema(description = "Type of change to filter by.", example = "UPDATED") ChangeType changeType,
        @Schema(description = "Username of the user who made the change to filter by.", example = "Winston")
                String changedBy) {}
