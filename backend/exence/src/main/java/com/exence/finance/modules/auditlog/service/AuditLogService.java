package com.exence.finance.modules.auditlog.service;

import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogFilter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface AuditLogService {

    Slice<AuditLogDTO> getWorkspaceAuditLogs(AuditLogFilter filter, Pageable pageable);

    Slice<AuditLogDTO> getAllAuditLogs(AuditLogFilter filter, Pageable pageable);
}
