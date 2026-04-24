import { effect, inject, resource, untracked } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { AuditLog } from '../../data-model/modules/audit-log/AuditLog';
import { AuditLogFilter } from '../../data-model/modules/audit-log/AuditLogFilter';
import { SliceResponse } from '../../data-model/modules/common/SliceResponse';
import { AdminAuditLogService } from '../../private/admin/admin-audit-log.service';
import { WorkspaceService } from '../workspace.service';
import { AuditLogService } from './audit-log.service';

export type AuditLogModel = AuditLog & { id: number };

interface AuditLogStoreState {
	adminLogs: SliceResponse<AuditLogModel>;
	adminPage: number;
	adminFilters: Partial<AuditLogFilter> | null;

	userLogs: SliceResponse<AuditLogModel>;
	userPage: number;
	userFilters: Partial<AuditLogFilter> | null;
}

const initialState: AuditLogStoreState = {
	adminLogs: {} as SliceResponse<AuditLogModel>,
	adminPage: 0,
	adminFilters: null,

	userLogs: {} as SliceResponse<AuditLogModel>,
	userPage: 0,
	userFilters: null,
};

export const AuditLogStore = signalStore(
	{ providedIn: 'root' },

	withState(initialState),

	withProps((store, adminService = inject(AdminAuditLogService), userService = inject(AuditLogService)) => ({
		adminResource: resource({
			params: () => {
				const filters = store.adminFilters();
				if (filters === null) return undefined;
				return { page: store.adminPage(), filters };
			},
			loader: async ({ params }) => await adminService.list(params.filters as AuditLogFilter, params.page),
		}),
		userResource: resource({
			params: () => {
				const filters = store.userFilters();
				if (filters === null) return undefined;
				return { page: store.userPage(), filters };
			},
			loader: async ({ params }) => await userService.list(params.filters as AuditLogFilter, params.page),
		}),
	})),

	withMethods(store => ({
		updateAdminFilters(filters: Partial<AuditLogFilter>): void {
			if (JSON.stringify(store.adminFilters()) === JSON.stringify(filters)) return;
			patchState(store, { adminFilters: { ...filters }, adminPage: 0 });
		},
		updateUserFilters(filters: Partial<AuditLogFilter>): void {
			if (JSON.stringify(store.userFilters()) === JSON.stringify(filters)) return;
			patchState(store, { userFilters: { ...filters }, userPage: 0 });
		},
		loadAdminNextPage(): void {
			if (!store.adminResource.isLoading() && store.adminLogs().hasNext) {
				patchState(store, state => ({ adminPage: state.adminPage + 1 }));
			}
		},
		loadUserNextPage(): void {
			if (!store.userResource.isLoading() && store.userLogs().hasNext) {
				patchState(store, state => ({ userPage: state.userPage + 1 }));
			}
		},
		resetAdmin(): void {
			patchState(store, { adminLogs: {} as SliceResponse<AuditLogModel>, adminPage: 0 });
			store.adminResource.reload();
		},
		resetUser(): void {
			patchState(store, { userLogs: {} as SliceResponse<AuditLogModel>, userPage: 0 });
			store.userResource.reload();
		},
	})),

	withHooks({
		onInit(store): void {
			effect(() => {
				const val = store.adminResource.value();
				if (val && !store.adminResource.isLoading()) {
					patchState(store, state => {
						const isReset = val.page === 0;
						const startId = isReset ? 0 : (state.adminLogs.content?.length ?? 0);
						const mapped: AuditLogModel[] = (val.content ?? []).map((log, i) => ({
							...log,
							id: startId + i,
						}));
						return {
							adminLogs: {
								...val,
								content: isReset ? mapped : [...(state.adminLogs.content ?? []), ...mapped],
							},
						};
					});
				}
			});

			effect(() => {
				const val = store.userResource.value();
				if (val && !store.userResource.isLoading()) {
					patchState(store, state => {
						const isReset = val.page === 0;
						const startId = isReset ? 0 : (state.userLogs.content?.length ?? 0);
						const mapped: AuditLogModel[] = (val.content ?? []).map((log, i) => ({
							...log,
							id: startId + i,
						}));
						return {
							userLogs: {
								...val,
								content: isReset ? mapped : [...(state.userLogs.content ?? []), ...mapped],
							},
						};
					});
				}
			});

			const workspaceService = inject(WorkspaceService);
			let previousWorkspace = untracked(() => workspaceService.currentWorkspace());

			effect(() => {
				const current = workspaceService.currentWorkspace();
				if (current !== previousWorkspace) {
					previousWorkspace = current;
					untracked(() => {
						store.resetAdmin();
						store.resetUser();
					});
				}
			});
		},
	}),
);
