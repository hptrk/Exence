import { Component, computed, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoService } from '@jsverse/transloco';
import { WorkspaceCreateRequest } from '../../../../data-model/modules/workspaces/WorkspaceCreateRequest';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { SnackbarService } from '../../../../shared/snackbar/snackbar.service';
import { WorkspaceService } from '../../../../shared/workspace.service';
import { WorkspaceSettingsStore } from '../workspace.store';
import { CreateWorkspaceDialogComponent } from '../create-workspace-dialog/create-workspace-dialog.component';
import { WorkspaceItemComponent } from '../workspace-item/workspace-item.component';

@Component({
	selector: 'ex-workspace-list',
	templateUrl: './workspace-list.component.html',
	styleUrl: './workspace-list.component.scss',
	imports: [MatProgressSpinnerModule, WorkspaceItemComponent, ButtonComponent, TranslatePipe],
})
export class WorkspaceListComponent {
	private readonly workspaceService = inject(WorkspaceService);
	private readonly store = inject(WorkspaceSettingsStore);
	private readonly dialog = inject(DialogService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);

	workspaces = this.store.workspaces;
	loading = this.store.workspacesResource.isLoading;
	currentWorkspaceId = computed<number | null>(() => this.workspaceService.currentWorkspace()?.id ?? null);

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal<undefined, WorkspaceCreateRequest | null>(
			CreateWorkspaceDialogComponent,
			undefined,
		);
		if (result) {
			const created = await this.store.createWorkspace(result);
			this.snackbarService.showSuccess(
				this.translocoService.translate('profile.workspaces.create.success', { workspaceName: created.name }),
			);
		}
	}
}
