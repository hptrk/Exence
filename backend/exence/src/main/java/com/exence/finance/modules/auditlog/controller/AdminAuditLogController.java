package com.exence.finance.modules.auditlog.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.dto.SliceResponse;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogFilter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

@Tag(name = "Admin Audit Logs", description = "Admin-only access to all platform audit logs")
public interface AdminAuditLogController {

    @ExenceOpenApi(
            summary = "List all audit logs (admin)",
            description =
                    "Returns a paginated slice of audit log entries across all workspaces and users. Accessible only"
                            + " to users with the ADMIN role. Results can be filtered by entity type, change type,"
                            + " date range, and the username who made the change. Sorted by change timestamp"
                            + " descending by default.",
            successStatus = 200,
            successDescription = "Paginated slice of all audit log entries returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.ACCESS_DENIED, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<SliceResponse<AuditLogDTO>> getAllAuditLogs(AuditLogFilter filter, Pageable pageable);
}
