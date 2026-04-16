package com.exence.finance.modules.auditlog.dto;

import com.exence.finance.modules.auditlog.enums.ChangeType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

@Schema(title = "Audit Log DTO", description = "Used for representing an audit log entry.")
public record AuditLogDTO(
        @Schema(description = "Type of the entity that was changed.", example = "TRANSACTION") String entityType,
        @Schema(description = "ID of the entity that was changed.", example = "1") String entityId,
        @Schema(description = "Type of change that occurred.", example = "UPDATED") ChangeType action,
        @Schema(description = "Timestamp when the change occurred.", example = "2026-06-15T14:30:00Z")
                Instant changedAt,
        @Schema(description = "Username of the user who made the change.", example = "Winston") String changedBy,
        @Schema(description = "List of field-level changes that occurred in this audit log entry.")
                List<AuditLogChangeDTO> changes) {}
