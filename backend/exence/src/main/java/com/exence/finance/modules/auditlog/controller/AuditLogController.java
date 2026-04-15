package com.exence.finance.modules.auditlog.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.dto.SliceResponse;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogFilter;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface AuditLogController {

    @ExenceOpenApi(
            summary = "List audit logs for the current workspace",
            description = "Returns a paginated slice of audit log entries scoped to the authenticated user's active"
                    + " workspace. This endpoint can only be accessed by the workspace owner. Results can be filtered by"
                    + " entity type, change type, date range, and the user's email who made the change. Sorted by change"
                    + " timestamp descending by default.",
            successStatus = 200,
            successDescription = "Paginated slice of audit log entries returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.WORKSPACE_NOT_FOUND, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<SliceResponse<AuditLogDTO>> getWorkspaceAuditLogs(AuditLogFilter filter, Pageable pageable);
}
