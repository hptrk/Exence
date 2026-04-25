import { provideZonelessChangeDetection, signal, ɵEffectScheduler } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AuditLog } from '../../../app/data-model/modules/audit-log/AuditLog';
import { AuditableEntityType } from '../../../app/data-model/modules/audit-log/AuditableEntityType';
import { ChangeType } from '../../../app/data-model/modules/audit-log/ChangeType';
import { SliceResponse } from '../../../app/data-model/modules/common/SliceResponse';
import { WorkspaceGet } from '../../../app/data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceRole } from '../../../app/data-model/modules/workspaces/WorkspaceRole';
import { AdminAuditLogService } from '../../../app/private/admin/admin-audit-log.service';
import { AuditLogStore } from '../../../app/shared/audit-log/audit-log.store';
import { AuditLogService } from '../../../app/shared/audit-log/audit-log.service';
import { WorkspaceService } from '../../../app/shared/workspace.service';

function makeLog(entityId: string): AuditLog {
	return {
		entityType: AuditableEntityType.TRANSACTION,
		entityId,
		action: ChangeType.CREATED,
		changedAt: new Date('2026-01-01'),
		changedBy: new Date('2026-01-01'),
		changes: [],
	};
}

function emptySlice(page = 0, hasNext = false): SliceResponse<AuditLog> {
	return { content: [], page, size: 20, first: page === 0, last: !hasNext, hasNext, numberOfElements: 0 };
}

async function waitForResources(): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, 0));
	TestBed.flushEffects();
}

describe('AuditLogStore', () => {
	let store: InstanceType<typeof AuditLogStore>;
	let mockAdminService: jasmine.SpyObj<AdminAuditLogService>;
	let mockUserService: jasmine.SpyObj<AuditLogService>;
	let currentWorkspace: ReturnType<typeof signal<WorkspaceGet | null>>;

	beforeEach(() => {
		mockAdminService = jasmine.createSpyObj<AdminAuditLogService>('AdminAuditLogService', ['list']);
		mockAdminService.list.and.resolveTo(emptySlice());

		mockUserService = jasmine.createSpyObj<AuditLogService>('AuditLogService', ['list']);
		mockUserService.list.and.resolveTo(emptySlice());

		currentWorkspace = signal<WorkspaceGet | null>(null);

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				AuditLogStore,
				{ provide: AdminAuditLogService, useValue: mockAdminService },
				{ provide: AuditLogService, useValue: mockUserService },
				{ provide: WorkspaceService, useValue: { currentWorkspace: currentWorkspace.asReadonly() } },
			],
		});

		store = TestBed.inject(AuditLogStore);
	});

	// Initial state
	describe('initial state', () => {
		it('adminPage starts at 0', () => {
			expect(store.adminPage()).toBe(0);
		});

		it('userPage starts at 0', () => {
			expect(store.userPage()).toBe(0);
		});

		it('adminFilters starts as null', () => {
			expect(store.adminFilters()).toBeNull();
		});

		it('userFilters starts as null', () => {
			expect(store.userFilters()).toBeNull();
		});
	});

	// updateAdminFilters
	describe('updateAdminFilters', () => {
		it('sets adminFilters and resets adminPage to 0', () => {
			store.updateAdminFilters({ entityType: AuditableEntityType.TRANSACTION });
			expect(store.adminFilters()).toEqual({ entityType: AuditableEntityType.TRANSACTION });
			expect(store.adminPage()).toBe(0);
		});

		it('is a no-op when called with identical filters', () => {
			store.updateAdminFilters({ entityType: AuditableEntityType.TRANSACTION });
			const callCount = mockAdminService.list.calls.count();
			store.updateAdminFilters({ entityType: AuditableEntityType.TRANSACTION });
			expect(mockAdminService.list.calls.count()).toBe(callCount);
		});
	});

	// updateUserFilters
	describe('updateUserFilters', () => {
		it('sets userFilters and resets userPage to 0', () => {
			store.updateUserFilters({ entityType: AuditableEntityType.GOAL });
			expect(store.userFilters()).toEqual({ entityType: AuditableEntityType.GOAL });
			expect(store.userPage()).toBe(0);
		});

		it('is a no-op when called with identical filters', () => {
			store.updateUserFilters({ entityType: AuditableEntityType.GOAL });
			const callCount = mockUserService.list.calls.count();
			store.updateUserFilters({ entityType: AuditableEntityType.GOAL });
			expect(mockUserService.list.calls.count()).toBe(callCount);
		});
	});

	// loadAdminNextPage
	describe('loadAdminNextPage', () => {
		it('increments adminPage when adminLogs hasNext is true', async () => {
			mockAdminService.list.and.resolveTo(emptySlice(0, true));
			store.updateAdminFilters({});
			await waitForResources();
			store.loadAdminNextPage();
			expect(store.adminPage()).toBe(1);
		});

		it('is a no-op when adminLogs hasNext is false', async () => {
			store.updateAdminFilters({});
			await waitForResources();
			store.loadAdminNextPage();
			expect(store.adminPage()).toBe(0);
		});
	});

	// loadUserNextPage
	describe('loadUserNextPage', () => {
		it('increments userPage when userLogs hasNext is true', async () => {
			mockUserService.list.and.resolveTo(emptySlice(0, true));
			store.updateUserFilters({});
			await waitForResources();
			store.loadUserNextPage();
			expect(store.userPage()).toBe(1);
		});

		it('is a no-op when userLogs hasNext is false', async () => {
			store.updateUserFilters({});
			await waitForResources();
			store.loadUserNextPage();
			expect(store.userPage()).toBe(0);
		});
	});

	// resetAdmin / resetUser
	describe('resetAdmin', () => {
		it('resets adminPage to 0', () => {
			store.resetAdmin();
			expect(store.adminPage()).toBe(0);
		});

		it('calls adminResource.reload()', () => {
			spyOn(store.adminResource, 'reload');
			store.resetAdmin();
			expect(store.adminResource.reload).toHaveBeenCalledTimes(1);
		});
	});

	describe('resetUser', () => {
		it('resets userPage to 0', () => {
			store.resetUser();
			expect(store.userPage()).toBe(0);
		});

		it('calls userResource.reload()', () => {
			spyOn(store.userResource, 'reload');
			store.resetUser();
			expect(store.userResource.reload).toHaveBeenCalledTimes(1);
		});
	});

	// Pagination accumulation
	describe('pagination accumulation', () => {
		it('appends page 1 admin logs after page 0 admin logs with sequential ids', async () => {
			const log0 = makeLog('e0');
			const log1 = makeLog('e1');
			const log2 = makeLog('e2');
			const log3 = makeLog('e3');

			const page0: SliceResponse<AuditLog> = { ...emptySlice(0, true), content: [log0, log1] };
			const page1: SliceResponse<AuditLog> = { ...emptySlice(1, false), content: [log2, log3] };

			mockAdminService.list.and.resolveTo(page0);
			store.updateAdminFilters({});
			await waitForResources();
			expect(store.adminLogs().content?.length).toBe(2);
			expect(store.adminLogs().content?.[0].id).toBe(0);
			expect(store.adminLogs().content?.[1].id).toBe(1);

			mockAdminService.list.and.resolveTo(page1);
			store.loadAdminNextPage();
			await waitForResources();

			const content = store.adminLogs().content!;
			expect(content.length).toBe(4);
			expect(content[0].entityId).toBe('e0');
			expect(content[1].entityId).toBe('e1');
			expect(content[2].entityId).toBe('e2');
			expect(content[3].entityId).toBe('e3');
			expect(content[0].id).toBe(0);
			expect(content[1].id).toBe(1);
			expect(content[2].id).toBe(2);
			expect(content[3].id).toBe(3);
		});

		it('appends page 1 user logs after page 0 user logs', async () => {
			const log0 = makeLog('u0');
			const log1 = makeLog('u1');
			const page0: SliceResponse<AuditLog> = { ...emptySlice(0, true), content: [log0] };
			const page1: SliceResponse<AuditLog> = { ...emptySlice(1, false), content: [log1] };

			mockUserService.list.and.resolveTo(page0);
			store.updateUserFilters({});
			await waitForResources();

			mockUserService.list.and.resolveTo(page1);
			store.loadUserNextPage();
			await waitForResources();

			const content = store.userLogs().content!;
			expect(content.length).toBe(2);
			expect(content[0].entityId).toBe('u0');
			expect(content[1].entityId).toBe('u1');
		});
	});

	// Workspace change
	describe('workspace change', () => {
		it('triggers resetAdmin and resetUser when workspace changes', () => {
			spyOn(store.adminResource, 'reload');
			spyOn(store.userResource, 'reload');
			const mockWorkspace: WorkspaceGet = { id: 1, name: 'Test', role: WorkspaceRole.OWNER };
			currentWorkspace.set(mockWorkspace);
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.adminResource.reload).toHaveBeenCalled();
			expect(store.userResource.reload).toHaveBeenCalled();
		});
	});
});
