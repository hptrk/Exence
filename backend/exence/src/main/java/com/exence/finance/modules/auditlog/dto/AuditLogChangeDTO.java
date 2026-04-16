package com.exence.finance.modules.auditlog.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Audit Log Change DTO", description = "Represents a single change in an audit log entry.")
public record AuditLogChangeDTO(
        @Schema(description = "Name of the field that was changed.", example = "amount") String field,
        @Schema(description = "Value of the field before the change.", example = "12300.00") String from,
        @Schema(description = "Value of the field after the change.", example = "13630.00") String to) {}
