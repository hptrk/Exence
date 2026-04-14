package com.exence.finance.modules.auditlog.controller;

import com.exence.finance.common.dto.SliceResponse;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogFilter;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface AdminAuditLogController {

    ResponseEntity<SliceResponse<AuditLogDTO>> getAllAuditLogs(AuditLogFilter filter, Pageable pageable);
}
