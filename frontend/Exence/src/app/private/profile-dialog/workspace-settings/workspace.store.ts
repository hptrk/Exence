import { effect, inject, resource } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { WorkspaceGet } from '../../../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceCreateRequest } from '../../../data-model/modules/workspaces/WorkspaceCreateRequest';
import { WorkspaceRenameRequest } from '../../../data-model/modules/workspaces/WorkspaceRenameRequest';
import { WorkspaceService } from '../../../shared/workspace.service';
import { AuditLogStore } from '../../../shared/audit-log/audit-log.store';

interface WorkspaceSettingsStoreData {
	workspaces: WorkspaceGet[];
}

const initialState: WorkspaceSettingsStoreData = {
	workspaces: [],
};

export const WorkspaceSettingsStore = signalStore(
	withState(initialState),

	withProps((_, workspaceService = inject(WorkspaceService)) => {
		return {
			workspacesResource: resource<WorkspaceGet[], undefined>({
				loader: async () => await workspaceService.list(),
			}),
		};
	}),

	withMethods((store, workspaceService = inject(WorkspaceService), auditLogStore = inject(AuditLogStore)) => {
		return {
			async createWorkspace(request: WorkspaceCreateRequest): Promise<WorkspaceGet> {
				const created = await workspaceService.create(request);
				patchState(store, state => ({
					workspaces: [...state.workspaces, created],
				}));
				workspaceService.setWorkspace(created);
				auditLogStore.resetUser();
				auditLogStore.resetAdmin();
				return created;
			},

			async deleteWorkspace(id: number): Promise<void> {
				await workspaceService.delete(id);
				patchState(store, state => ({
					workspaces: state.workspaces.filter(w => w.id !== id),
				}));
				auditLogStore.resetUser();
				auditLogStore.resetAdmin();
			},

			async updateWorkspace(id: number, request: WorkspaceRenameRequest): Promise<void> {
				await workspaceService.update(id, request);
				patchState(store, state => ({
					workspaces: state.workspaces.map(w => (w.id === id ? { ...w, name: request.name } : w)),
				}));
				if (workspaceService.currentWorkspace()?.id === id) {
					workspaceService.setWorkspace({ ...workspaceService.currentWorkspace()!, name: request.name });
				}
				auditLogStore.resetUser();
				auditLogStore.resetAdmin();
			},

			removeWorkspaceFromList(id: number): void {
				patchState(store, state => ({
					workspaces: state.workspaces.filter(w => w.id !== id),
				}));
			},
		};
	}),

	withHooks({
		onInit(store): void {
			effect(() => {
				const val = store.workspacesResource.value();
				if (val && !store.workspacesResource.isLoading()) {
					patchState(store, _ => ({ workspaces: [...val] }));
				}
			});
		},
	}),
);
