import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoService } from '@jsverse/transloco';
import { AuditLogFilter } from '../../../data-model/modules/audit-log/AuditLogFilter';
import { AuditableEntityType } from '../../../data-model/modules/audit-log/AuditableEntityType';
import { ChangeType } from '../../../data-model/modules/audit-log/ChangeType';
import { WorkspaceMemberGet } from '../../../data-model/modules/workspaces/WorkspaceMemberGet';
import { AuditLogListComponent } from '../../../shared/audit-log/audit-log-list/audit-log-list.component';
import { AuditLogStore } from '../../../shared/audit-log/audit-log.store';
import { FilterMenuComponent } from '../../../shared/filter-menu/filter-menu.component';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { toRawValueSignal } from '../../../shared/util/utils';
import { WorkspaceService } from '../../../shared/workspace.service';

@Component({
	selector: 'ex-user-audit-log',
	templateUrl: './user-audit-log.component.html',
	styleUrl: './user-audit-log.component.scss',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		AuditLogListComponent,
		FilterMenuComponent,
		InputClearButtonComponent,
		TranslatePipe,
	],
})
export class UserAuditLogComponent {
	private readonly store = inject(AuditLogStore);
	private readonly workspaceService = inject(WorkspaceService);
	private readonly translocoService = inject(TranslocoService);
	private readonly fb = inject(NonNullableFormBuilder);

	readonly data = this.store.userLogs;
	readonly isLoading = this.store.userResource.isLoading;

	private readonly allMembers = signal<WorkspaceMemberGet[]>([]);

	readonly filterForm = this.fb.group({
		entityType: this.fb.control<string>(''),
		changeType: this.fb.control<string>(''),
		changedBy: this.fb.control<string>(''),
		from: this.fb.control<Date | null>(null),
		to: this.fb.control<Date | null>(null),
	});

	private readonly filterFormValue = toRawValueSignal(this.filterForm);

	readonly filteredMembers = computed<WorkspaceMemberGet[]>(() => {
		const q = this.filterFormValue().changedBy.toLowerCase();
		const all = this.allMembers();
		return q ? all.filter(m => m.username.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) : all;
	});

	readonly showSystemOption = computed(() => {
		const q = this.filterFormValue().changedBy.toLowerCase();
		return !q || 'system'.includes(q);
	});

	readonly filteredEntityTypes = computed<AuditableEntityType[]>(() => {
		const q = this.filterFormValue().entityType.toLowerCase();
		return q
			? Object.values(AuditableEntityType).filter(t => t.toLowerCase().includes(q))
			: Object.values(AuditableEntityType);
	});

	readonly filteredChangeTypes = computed<ChangeType[]>(() => {
		const q = this.filterFormValue().changeType.toLowerCase();
		return q ? Object.values(ChangeType).filter(t => t.toLowerCase().includes(q)) : Object.values(ChangeType);
	});

	readonly appliedFiltersCount = computed(() => {
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
			this.store.updateUserFilters(filters);
		});
	}

	codeForEntityType(type: AuditableEntityType): TranslationCode {
		return `auditLog.entityTypeLabel.${type}`;
	}

	codeForChangeType(type: ChangeType): TranslationCode {
		return `auditLog.changeType.${type}`;
	}

	displayEntityType(value: string | null): string {
		if (!value) return '';
		return this.translocoService.translate(`auditLog.entityTypeLabel.${value}`);
	}

	displayChangeType(value: string | null): string {
		if (!value) return '';
		return this.translocoService.translate(`auditLog.changeType.${value}`);
	}

	onScroll(): void {
		this.store.loadUserNextPage();
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
