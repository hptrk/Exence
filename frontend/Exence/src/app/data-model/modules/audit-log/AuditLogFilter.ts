import { AuditableEntityType } from './AuditableEntityType';
import { ChangeType } from './ChangeType';

export interface AuditLogFilter {
	entityType: AuditableEntityType;
	from: Date;
	to: Date;
	changeType: ChangeType;
	changedBy: string;
}
