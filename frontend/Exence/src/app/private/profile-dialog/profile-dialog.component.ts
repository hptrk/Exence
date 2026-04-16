import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@jsverse/transloco';
import { WorkspaceGet } from '../../data-model/modules/workspaces/WorkspaceGet';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogComponent } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { WorkspaceService } from '../../shared/workspace.service';
import { SessionsListComponent } from '../session/sessions-list/sessions-list.component';
import { UserAuditLogComponent } from '../audit-log/user-audit-log/user-audit-log.component';
import { ProfileInformationComponent } from './profile-information/profile-information.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { WorkspaceSettingsComponent } from './workspace-settings/workspace-settings.component';
import { WorkspaceSettingsStore } from './workspace-settings/workspace.store';

@Component({
	selector: 'ex-profile-dialog',
	templateUrl: './profile-dialog.component.html',
	styleUrl: './profile-dialog.component.scss',
	imports: [
		CommonModule,
		MatSidenavModule,
		MatIconModule,
		MatDividerModule,
		MatDialogClose,
		MatMenuModule,
		MatTooltipModule,
		ProfileInformationComponent,
		UserSettingsComponent,
		WorkspaceSettingsComponent,
		SessionsListComponent,
		UserAuditLogComponent,
		AchievementsComponent,
		ButtonComponent,
		TranslatePipe,
	],
	providers: [WorkspaceSettingsStore],
	host: {
		'(window:beforeunload)': 'onBeforeUnload($event)',
	},
})
export class ProfileDialogComponent extends DialogComponent<void, void> {
	private readonly currentUserService = inject(CurrentUserService);
	private readonly workspaceService = inject(WorkspaceService);
	private readonly store = inject(WorkspaceSettingsStore);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);
	readonly display = inject(DisplaySizeService);

	selectedPage = signal<
		'workspace-settings' | 'profile-information' | 'user-settings' | 'sessions' | 'audit-log' | 'achievements'
	>('workspace-settings');

	username = computed<string>(() => this.currentUserService.user().username);
	usernameLetter = computed<string>(() => this.username().slice(0, 1).toUpperCase());
	workspaceName = computed<string | null>(() => this.workspaceService.currentWorkspace()?.name ?? null);
	workspaces = computed<WorkspaceGet[]>(() => this.store.workspaces());
	selectedWorkspaceId = computed<number | null>(() => this.workspaceService.currentWorkspace()?.id ?? null);

	switchWorkspace(id: number): void {
		const ws = this.workspaces().find(w => w.id === id);
		if (ws) {
			this.workspaceService.setWorkspace(ws);
			this.snackbarService.showSuccess(
				this.translocoService.translate('profile.switchWorkspaceSuccess', { workspaceName: ws.name }),
			);
		}
	}

	onBeforeUnload(event: BeforeUnloadEvent): void {
		if (this.dialogRef.isLocked) event.preventDefault();
	}
}
