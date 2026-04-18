import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@jsverse/transloco';
import { WorkspaceGet } from '../../../../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceMemberGet } from '../../../../data-model/modules/workspaces/WorkspaceMemberGet';
import { WorkspaceRole } from '../../../../data-model/modules/workspaces/WorkspaceRole';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { TranslationCode } from '../../../../shared/i18n/translation-types';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { SvgIcons } from '../../../../shared/svg-icons/svg-icons';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import {
	MessageDialogButtonConfig,
	MessageDialogComponent,
	PredefiedButtons,
} from '../../../../shared/message-dialog/message-dialog.component';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';
import {
	EditWorkspaceDialogComponent,
	EditWorkspaceDialogData,
} from '../edit-workspace-dialog/edit-workspace-dialog.component';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { WorkspaceService } from '../../../../shared/workspace.service';
import { WorkspaceSettingsStore } from '../workspace.store';
import { WorkspaceMemberEmailRequest } from '../../../../data-model/modules/workspaces/WorkspaceMemberEmailRequest';
import { WorkspaceRenameRequest } from '../../../../data-model/modules/workspaces/WorkspaceRenameRequest';
import { DisplaySizeService } from '../../../../shared/display-size.service';
import { AuditLogStore } from '../../../../shared/audit-log/audit-log.store';

@Component({
	selector: 'ex-workspace-item',
	templateUrl: './workspace-item.component.html',
	styleUrl: './workspace-item.component.scss',
	imports: [
		MatExpansionModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		DatePipe,
		TranslatePipe,
		ButtonComponent,
	],
})
export class WorkspaceItemComponent {
	private readonly workspaceService = inject(WorkspaceService);
	private readonly store = inject(WorkspaceSettingsStore);
	private readonly dialogService = inject(DialogService);
	private readonly translocoService = inject(TranslocoService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly auditLogStore = inject(AuditLogStore);
	readonly display = inject(DisplaySizeService);

	workspace = input.required<WorkspaceGet>();
	isActive = input.required<boolean>();

	loadingMembers = signal(false);
	members = signal<WorkspaceMemberGet[] | null>(null);

	isOwner = computed(() => this.workspace().role === WorkspaceRole.OWNER);

	workspaceDeletionDisabledReason = computed<TranslationCode>(() =>
		this.isActive()
			? 'profile.workspaces.deleteWorkspace.disabledActive'
			: 'profile.workspaces.deleteWorkspace.disabledOtherMembers',
	);

	readonly WorkspaceRole = WorkspaceRole;
	readonly SvgIcons = SvgIcons;

	getRoleIcon(role: WorkspaceRole): SvgIcons {
		return role === WorkspaceRole.OWNER ? SvgIcons.workspaceRoleOwner : SvgIcons.workspaceRoleMember;
	}

	getRoleTooltipKey(role: WorkspaceRole): TranslationCode {
		return role === WorkspaceRole.OWNER ? 'profile.workspaces.roleOwner' : 'profile.workspaces.roleMember';
	}

	async onOpened(): Promise<void> {
		if (this.members() !== null) return;
		this.loadingMembers.set(true);
		try {
			const members = await this.workspaceService.getMembers(this.workspace().id);
			this.members.set(members);
		} finally {
			this.loadingMembers.set(false);
		}
	}

	async onEditWorkspace(): Promise<void> {
		const result = await this.dialogService.openNonModal<EditWorkspaceDialogData, WorkspaceRenameRequest | null>(
			EditWorkspaceDialogComponent,
			{ workspace: this.workspace() },
			{ width: '600px' },
		);
		if (!result) return;
		await this.store.updateWorkspace(this.workspace().id, result);
		this.snackbarService.showSuccess(this.translocoService.translate('profile.workspaces.edit.success'));
	}

	async onAddMember(): Promise<void> {
		const result = await this.dialogService.openNonModal<undefined, WorkspaceMemberEmailRequest | null>(
			AddMemberDialogComponent,
			undefined,
			{
				width: '600px',
			},
		);
		if (!result) return;
		const member = await this.workspaceService.addMember(this.workspace().id, result);
		this.members.update(list => (list ? [...list, member] : [member]));
		this.snackbarService.showSuccess(
			this.translocoService.translate('profile.workspaces.addMember.success', {
				workspaceName: this.workspace().name,
			}),
		);
		this.auditLogStore.resetUser();
		this.auditLogStore.resetAdmin();
	}

	async onDeleteWorkspace(event: MouseEvent): Promise<void> {
		event.stopPropagation();
		const confirmed = await this.dialogService.openNonModal(MessageDialogComponent, {
			title: this.translocoService.translate('profile.workspaces.deleteWorkspace.title'),
			message: this.translocoService.translate('profile.workspaces.deleteWorkspace.message'),
			hideCloseIcon: false,
			buttons: MessageDialogButtonConfig.deleteCancel,
		});
		if (confirmed) {
			await this.store.deleteWorkspace(this.workspace().id);
			this.snackbarService.showSuccess(
				this.translocoService.translate('profile.workspaces.deleteWorkspace.success', {
					workspaceName: this.workspace().name,
				}),
			);
		}
	}

	async onMemberLeave(event: MouseEvent): Promise<void> {
		event.stopPropagation();
		const confirmed = await this.dialogService.openNonModal(MessageDialogComponent, {
			title: this.translocoService.translate('profile.workspaces.leaveWorkspace.title'),
			message: this.translocoService.translate('profile.workspaces.leaveWorkspace.message'),
			hideCloseIcon: false,
			buttons: MessageDialogButtonConfig.custom(
				{
					text: 'literals.leave',
					value: true,
					matIcon: 'logout',
					color: 'error',
				},
				PredefiedButtons.CANCEL,
			),
		});
		if (confirmed) {
			await this.workspaceService.removeSelf(this.workspace().id);
			this.store.removeWorkspaceFromList(this.workspace().id);
			this.snackbarService.showSuccess(
				this.translocoService.translate('profile.workspaces.leaveWorkspace.success', {
					workspaceName: this.workspace().name,
				}),
			);
			this.auditLogStore.resetUser();
			this.auditLogStore.resetAdmin();
		}
	}

	async onKickMember(member: WorkspaceMemberGet): Promise<void> {
		const confirmed = await this.dialogService.openNonModal(MessageDialogComponent, {
			title: this.translocoService.translate('profile.workspaces.kickMember.title'),
			message: this.translocoService.translate('profile.workspaces.kickMember.message', {
				name: member.username,
			}),
			hideCloseIcon: false,
			buttons: MessageDialogButtonConfig.deleteCancel,
		});
		if (confirmed) {
			await this.workspaceService.removeMember(this.workspace().id, { email: member.email });
			this.members.update(list => list?.filter(m => m.userId !== member.userId) ?? null);
			this.snackbarService.showSuccess(
				this.translocoService.translate('profile.workspaces.kickMember.success', { memberEmail: member.email }),
			);
			this.auditLogStore.resetUser();
			this.auditLogStore.resetAdmin();
		}
	}
}
