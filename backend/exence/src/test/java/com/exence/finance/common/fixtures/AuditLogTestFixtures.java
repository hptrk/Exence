package com.exence.finance.common.fixtures;

import com.exence.finance.modules.auditlog.dto.AuditLogChangeDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.enums.ChangeType;
import java.time.Instant;
import java.util.List;

public final class AuditLogTestFixtures {

    private AuditLogTestFixtures() {}

    public static AuditLogDTO createAuditLog() {
        return new AuditLogDTO(
                "TRANSACTION",
                "123",
                ChangeType.CREATED,
                Instant.parse("2026-03-15T10:30:00Z"),
                "testuser",
                List.of(
                        new AuditLogChangeDTO("amount", null, "500.00"),
                        new AuditLogChangeDTO("category", null, "Food")));
    }

    public static AuditLogDTO updateAuditLog() {
        return new AuditLogDTO(
                "TRANSACTION",
                "123",
                ChangeType.UPDATED,
                Instant.parse("2026-03-16T14:15:00Z"),
                "testuser",
                List.of(new AuditLogChangeDTO("amount", "500.00", "750.00")));
    }

    public static AuditLogDTO deleteAuditLog() {
        return new AuditLogDTO(
                "TRANSACTION", "123", ChangeType.DELETED, Instant.parse("2026-03-17T09:00:00Z"), "testuser", List.of());
    }

    public static AuditLogDTO goalAuditLog() {
        return new AuditLogDTO(
                "GOAL",
                "456",
                ChangeType.CREATED,
                Instant.parse("2026-02-01T08:45:00Z"),
                "admin",
                List.of(
                        new AuditLogChangeDTO("name", null, "Save for Vacation"),
                        new AuditLogChangeDTO("targetAmount", null, "10000.00")));
    }
}
