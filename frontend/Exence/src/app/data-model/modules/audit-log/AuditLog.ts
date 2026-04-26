import { AuditLogChange } from './AuditLogChange';
import { ChangeType } from './ChangeType';

export interface AuditLog {
	entityType: string;
	entityId: string;
	action: ChangeType;
	changedAt: Date;
	changedBy: Date;
	changes: AuditLogChange[];
}
