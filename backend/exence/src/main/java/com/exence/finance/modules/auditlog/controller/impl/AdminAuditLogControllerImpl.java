package com.exence.finance.modules.auditlog.controller.impl;

import static com.exence.finance.common.util.ApplicationConstants.DEFAULT_PAGE_SIZE;

import com.exence.finance.common.dto.SliceResponse;
import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.auditlog.controller.AdminAuditLogController;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogFilter;
import com.exence.finance.modules.auditlog.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-logs")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AdminAuditLogControllerImpl implements AdminAuditLogController {

    private final AuditLogService auditLogService;

    @Override
    @GetMapping
    public ResponseEntity<SliceResponse<AuditLogDTO>> getAllAuditLogs(
            @ModelAttribute AuditLogFilter filter,
            @PageableDefault(size = DEFAULT_PAGE_SIZE, sort = "changedAt", direction = Sort.Direction.DESC)
                    Pageable pageable) {
        return ResponseFactory.slice(auditLogService.getAllAuditLogs(filter, pageable));
    }
}
