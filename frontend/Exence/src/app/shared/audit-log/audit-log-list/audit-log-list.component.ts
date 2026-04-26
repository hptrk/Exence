import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { AuditableEntityType } from '../../../data-model/modules/audit-log/AuditableEntityType';
import { ChangeType } from '../../../data-model/modules/audit-log/ChangeType';
import { SliceResponse } from '../../../data-model/modules/common/SliceResponse';
import { ColumnDef, DataTableComponent } from '../../data-table/data-table.component';
import { ExCellDirective } from '../../data-table/ex-cell.directive';
import { DisplaySizeService } from '../../display-size.service';
import { TranslationCode } from '../../i18n/translation-types';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SvgIcons } from '../../svg-icons/svg-icons';
import { AuditLogModel } from '../audit-log.store';

export { AuditLogModel };

@Component({
	selector: 'ex-audit-log-list',
	templateUrl: './audit-log-list.component.html',
	styleUrl: './audit-log-list.component.scss',
	imports: [DataTableComponent, ExCellDirective, TranslatePipe, DatePipe, MatLabel],
})
export class AuditLogListComponent {
	readonly display = inject(DisplaySizeService);

	data = input<SliceResponse<AuditLogModel>>({} as SliceResponse<AuditLogModel>);
	isLoading = input<boolean>(false);
	title = input<string>('');
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();

	readonly scrolled = output<void>();

	private readonly allColumns: ColumnDef[] = [
		{ key: 'action', header: 'auditLog.action', width: 'auto' },
		{ key: 'entityType', header: 'auditLog.entityType', width: '120px' },
		{ key: 'changedBy', header: 'auditLog.changedBy', width: '35%' },
		{ key: 'changedAt', header: 'auditLog.changedAt', width: '140px' },
		{ key: 'actions', header: '', width: '50px' },
	];

	readonly columns = computed<ColumnDef[]>(() => {
		const isMd = this.display.isMd();
		const isLg = this.display.isLg();
		return this.allColumns
			.filter(c => isLg || c.key !== 'changedAt')
			.map(c => {
				if (!isMd && c.key === 'action') return { ...c, width: 'auto' };
				if (!isMd && c.key === 'changedBy') return { ...c, width: '100px' };
				return c;
			});
	});

	codeForField(field: string): TranslationCode {
		return `auditLog.field.${field}` as TranslationCode;
	}

	codeForChangeType(action: ChangeType): TranslationCode {
		return `auditLog.changeType.${action}`;
	}

	codeForEntityType(entityType: string): TranslationCode {
		let type: AuditableEntityType = AuditableEntityType.TRANSACTION;
		switch (entityType) {
			case 'Transaction': {
				type = AuditableEntityType.TRANSACTION;
				break;
			}
			case 'Category': {
				type = AuditableEntityType.CATEGORY;
				break;
			}
			case 'Goal': {
				type = AuditableEntityType.GOAL;
				break;
			}
			case 'Debt': {
				type = AuditableEntityType.DEBT;
				break;
			}
			case 'Investment': {
				type = AuditableEntityType.INVESTMENT;
				break;
			}
			case 'RecurringTransaction': {
				type = AuditableEntityType.RECURRING_TRANSACTION;
				break;
			}
			case 'Workspace': {
				type = AuditableEntityType.WORKSPACE;
				break;
			}
			case 'WorkspaceMember': {
				type = AuditableEntityType.WORKSPACE_MEMBER;
				break;
			}
		}
		return `auditLog.entityTypeLabel.${type}`;
	}
}
