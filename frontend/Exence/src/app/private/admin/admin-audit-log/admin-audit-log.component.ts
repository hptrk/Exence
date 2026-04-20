import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuditLogFilter } from '../../../data-model/modules/audit-log/AuditLogFilter';
import { AuditableEntityType } from '../../../data-model/modules/audit-log/AuditableEntityType';
import { ChangeType } from '../../../data-model/modules/audit-log/ChangeType';
import { WorkspaceMemberGet } from '../../../data-model/modules/workspaces/WorkspaceMemberGet';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { AuditLogListComponent } from '../../../shared/audit-log/audit-log-list/audit-log-list.component';
import { AuditLogStore } from '../../../shared/audit-log/audit-log.store';
import { FilterMenuComponent } from '../../../shared/filter-menu/filter-menu.component';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { WorkspaceService } from '../../../shared/workspace.service';
import { toRawValueSignal } from '../../../shared/util/utils';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
	selector: 'ex-admin-audit-log',
	templateUrl: './admin-audit-log.component.html',
	styleUrl: './admin-audit-log.component.scss',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatSelectModule,
		MatAutocompleteModule,
		AuditLogListComponent,
		FilterMenuComponent,
		InputClearButtonComponent,
		TranslatePipe,
		EnumValuePipe,
	],
})
export class AdminAuditLogComponent {
	private readonly store = inject(AuditLogStore);
	private readonly workspaceService = inject(WorkspaceService);
	private readonly fb = inject(NonNullableFormBuilder);

	data = this.store.adminLogs;
	isLoading = this.store.adminResource.isLoading;

	allMembers = signal<WorkspaceMemberGet[]>([]);

	filterForm = this.fb.group({
		entityType: this.fb.control<string>(''),
		changeType: this.fb.control<string>(''),
		changedBy: this.fb.control<string>(''),
		from: this.fb.control<Date | null>(null),
		to: this.fb.control<Date | null>(null),
	});
	filterFormValue = toRawValueSignal(this.filterForm);

	filteredMembers = computed<WorkspaceMemberGet[]>(() => {
		const q = this.filterFormValue().changedBy.toLowerCase();
		const all = this.allMembers();
		return q ? all.filter(m => m.username.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) : all;
	});

	showSystemOption = computed(() => {
		const q = this.filterFormValue().changedBy.toLowerCase();
		return !q || 'system'.includes(q);
	});

	readonly entityTypes = AuditableEntityType;
	readonly changeTypes = ChangeType;

	appliedFiltersCount = computed(() => {
		const v = this.filterFormValue();
		return [
			v.entityType && Object.values(AuditableEntityType).includes(v.entityType as AuditableEntityType)
				? v.entityType
				: null,
			v.changeType && Object.values(ChangeType).includes(v.changeType as ChangeType) ? v.changeType : null,
			v.changedBy || null,
			v.from,
			v.to,
		].filter(Boolean).length;
	});

	constructor() {
		effect(() => {
			const workspace = this.workspaceService.currentWorkspace();
			if (workspace) {
				this.workspaceService.getMembers(workspace.id).then(members => this.allMembers.set(members));
			}
		});

		effect(() => {
			const filters = this.buildFilters(this.filterFormValue());
			this.store.updateAdminFilters(filters);
		});
	}

	codeForEntityType(type: AuditableEntityType): TranslationCode {
		return `auditLog.entityTypeLabel.${type}`;
	}

	codeForChangeType(type: ChangeType): TranslationCode {
		return `auditLog.changeType.${type}`;
	}

	onScroll(): void {
		this.store.loadAdminNextPage();
	}

	private buildFilters(v: ReturnType<typeof this.filterForm.getRawValue>): Partial<AuditLogFilter> {
		const filters: Partial<AuditLogFilter> = {};
		const validEntityTypes = Object.values(AuditableEntityType) as string[];
		const validChangeTypes = Object.values(ChangeType) as string[];
		if (v.entityType && validEntityTypes.includes(v.entityType))
			filters.entityType = v.entityType as AuditableEntityType;
		if (v.changeType && validChangeTypes.includes(v.changeType)) filters.changeType = v.changeType as ChangeType;
		if (v.changedBy) filters.changedBy = v.changedBy;
		if (v.from) filters.from = v.from;
		if (v.to) filters.to = v.to;
		return filters;
	}
}
