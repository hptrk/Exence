import { effect, inject, resource, untracked } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { AuditLog } from '../../data-model/modules/audit-log/AuditLog';
import { AuditLogFilter } from '../../data-model/modules/audit-log/AuditLogFilter';
import { AdminAuditLogService } from '../../private/admin/admin-audit-log.service';
import { WorkspaceService } from '../workspace.service';
import { AuditLogService } from './audit-log.service';

export type AuditLogModel = AuditLog & { id: number };

interface AuditLogStoreState {
	adminLogs: AuditLogModel[];
	adminPage: number;
	adminHasNext: boolean;
	adminFilters: Partial<AuditLogFilter> | null;

	userLogs: AuditLogModel[];
	userPage: number;
	userHasNext: boolean;
	userFilters: Partial<AuditLogFilter> | null;
}

const initialState: AuditLogStoreState = {
	adminLogs: [],
	adminPage: 0,
	adminHasNext: false,
	adminFilters: null,

	userLogs: [],
	userPage: 0,
	userHasNext: false,
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
			if (!store.adminResource.isLoading() && store.adminHasNext()) {
				patchState(store, state => ({ adminPage: state.adminPage + 1 }));
			}
		},
		loadUserNextPage(): void {
			if (!store.userResource.isLoading() && store.userHasNext()) {
				patchState(store, state => ({ userPage: state.userPage + 1 }));
			}
		},
		resetAdmin(): void {
			patchState(store, { adminLogs: [], adminPage: 0, adminHasNext: false });
			store.adminResource.reload();
		},
		resetUser(): void {
			patchState(store, { userLogs: [], userPage: 0, userHasNext: false });
			store.userResource.reload();
		},
	})),

	withHooks({
		onInit(store): void {
			effect(() => {
				const val = store.adminResource.value();
				if (val && !store.adminResource.isLoading()) {
					patchState(store, state => {
						const isReset = state.adminPage === 0;
						const startId = isReset ? 0 : state.adminLogs.length;
						const mapped: AuditLogModel[] = (val.content ?? []).map((log, i) => ({
							...log,
							id: startId + i,
						}));
						return {
							adminLogs: isReset ? mapped : [...state.adminLogs, ...mapped],
							adminHasNext: val.hasNext,
						};
					});
				}
			});

			effect(() => {
				const val = store.userResource.value();
				if (val && !store.userResource.isLoading()) {
					patchState(store, state => {
						const isReset = state.userPage === 0;
						const startId = isReset ? 0 : state.userLogs.length;
						const mapped: AuditLogModel[] = (val.content ?? []).map((log, i) => ({
							...log,
							id: startId + i,
						}));
						return {
							userLogs: isReset ? mapped : [...state.userLogs, ...mapped],
							userHasNext: val.hasNext,
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
