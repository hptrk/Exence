package com.exence.finance.modules.auditlog.mapper;

import com.exence.finance.modules.auditlog.dto.AuditLogChangeDTO;
import com.exence.finance.modules.auditlog.dto.AuditLogDTO;
import com.exence.finance.modules.auditlog.enums.ChangeType;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;
import org.javers.core.diff.Change;
import org.javers.core.diff.changetype.NewObject;
import org.javers.core.diff.changetype.ObjectRemoved;
import org.javers.core.diff.changetype.ValueChange;
import org.javers.core.metamodel.object.GlobalId;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogDTO toAuditLogDTO(List<Change> group) {
        Change first = group.get(0);
        var commitMeta = first.getCommitMetadata().get();
        GlobalId globalId = first.getAffectedGlobalId();

        String entityType = extractEntityType(globalId);
        String entityId = extractEntityId(globalId);
        String changedBy = commitMeta.getAuthor();
        var changedAt = commitMeta.getCommitDate().toInstant(ZoneOffset.UTC);

        boolean isCreated = group.stream().anyMatch(c -> c instanceof NewObject);
        boolean isDeleted = group.stream().anyMatch(c -> c instanceof ObjectRemoved);

        ChangeType action;
        List<AuditLogChangeDTO> fieldChanges;

        if (isCreated) {
            action = ChangeType.CREATED;
            fieldChanges = List.of();
        } else if (isDeleted) {
            action = ChangeType.DELETED;
            fieldChanges = List.of();
        } else {
            action = ChangeType.UPDATED;
            fieldChanges = group.stream()
                    .filter(c -> c instanceof ValueChange)
                    .map(c -> (ValueChange) c)
                    .map(vc -> new AuditLogChangeDTO(
                            vc.getPropertyName(),
                            vc.getLeft() != null ? vc.getLeft().toString() : null,
                            vc.getRight() != null ? vc.getRight().toString() : null))
                    .collect(Collectors.toList());
        }

        return new AuditLogDTO(entityType, entityId, action, changedAt, changedBy, fieldChanges);
    }

    private String extractEntityType(GlobalId globalId) {
        String typeName = globalId.getTypeName();
        int lastDot = typeName.lastIndexOf('.');
        return lastDot >= 0 ? typeName.substring(lastDot + 1) : typeName;
    }

    private String extractEntityId(GlobalId globalId) {
        String raw = globalId.toString();
        int slash = raw.lastIndexOf('/');
        return slash >= 0 ? raw.substring(slash + 1) : raw;
    }
}
