import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { AuditLogStore, AuditLogModel } from '../../../app/shared/audit-log/audit-log.store';
import { AdminAuditLogService } from '../../../app/private/admin/admin-audit-log.service';
import { WorkspaceService } from '../../../app/shared/workspace.service';
import { ErrorService } from '../../../app/shared/error.service';
import { AuditableEntityType } from '../../../app/data-model/modules/audit-log/AuditableEntityType';
import { SliceResponse } from '../../../app/data-model/modules/common/SliceResponse';

const EMPTY_SLICE: SliceResponse<AuditLogModel> = {
	content: [],
	hasNext: false,
	page: 0,
	size: 0,
	first: true,
	last: true,
	numberOfElements: 0,
};

describe('AuditLogStore resource() reactivity', () => {
	let store: InstanceType<typeof AuditLogStore>;
	let httpTesting: HttpTestingController;
	let mockAdminAuditLogService: jasmine.SpyObj<AdminAuditLogService>;
	let mockWorkspaceService: { currentWorkspace: ReturnType<typeof signal> };

	const mockErrorService = {
		handleError: jasmine.createSpy('handleError'),
	};

	beforeEach(async () => {
		mockAdminAuditLogService = jasmine.createSpyObj('AdminAuditLogService', ['list']);
		mockAdminAuditLogService.list.and.returnValue(Promise.resolve(EMPTY_SLICE));

		mockWorkspaceService = { currentWorkspace: signal(null) };

		await TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: AdminAuditLogService, useValue: mockAdminAuditLogService },
				{ provide: WorkspaceService, useValue: mockWorkspaceService },
				{ provide: ErrorService, useValue: mockErrorService },
				AuditLogStore,
			],
		}).compileComponents();

		store = TestBed.inject(AuditLogStore);
		httpTesting = TestBed.inject(HttpTestingController);
		TestBed.flushEffects();
	});

	afterEach(() => {
		httpTesting.verify();
		TestBed.resetTestingModule();
	});

	it('should NOT dispatch an HTTP request when userFilters is null (initial state)', async () => {
		await Promise.resolve();
		httpTesting.expectNone(r => r.url.includes('/api/audit-logs'));
	});

	it('should dispatch an HTTP request when userFilters becomes non-null', async () => {
		store.updateUserFilters({});
		TestBed.flushEffects();
		await Promise.resolve();

		const req = httpTesting.expectOne(r => r.url.includes('/api/audit-logs'));
		expect(req.request.method).toBe('GET');
		req.flush(EMPTY_SLICE);

		for (let i = 0; i < 5; i++) {
			await Promise.resolve();
		}
		TestBed.flushEffects();
		await Promise.resolve();
	});

	it('should auto-dispatch a new HTTP request when userFilters signal changes — without calling reload()', async () => {
		store.updateUserFilters({});
		TestBed.flushEffects();
		await Promise.resolve();

		const req1 = httpTesting.expectOne(r => r.url.includes('/api/audit-logs'));
		req1.flush(EMPTY_SLICE);

		for (let i = 0; i < 5; i++) {
			await Promise.resolve();
		}
		TestBed.flushEffects();
		await Promise.resolve();

		// Change filters to a different value — resource() params changes → new loader run automatically
		store.updateUserFilters({ entityType: AuditableEntityType.TRANSACTION });
		TestBed.flushEffects();
		await Promise.resolve();

		const req2 = httpTesting.expectOne(r => r.url.includes('/api/audit-logs'));
		expect(req2.request.params.get('entityType')).toBe('TRANSACTION');
		req2.flush(EMPTY_SLICE);

		for (let i = 0; i < 5; i++) {
			await Promise.resolve();
		}
		TestBed.flushEffects();
		await Promise.resolve();
	});

	it('should auto-dispatch a new HTTP request when userPage signal changes via loadUserNextPage()', async () => {
		store.updateUserFilters({});
		TestBed.flushEffects();
		await Promise.resolve();

		const req1 = httpTesting.expectOne(r => r.url.includes('/api/audit-logs'));
		req1.flush({
			content: [{ id: 1 }],
			hasNext: true,
			page: 0,
			size: 20,
			first: true,
			last: false,
			numberOfElements: 1,
		});

		// The resource loader is async (Promise-based). After flushing the HTTP response:
		// 1. lastValueFrom() promise resolves (microtask tick)
		// 2. resource() updates value() and isLoading()=false (microtask tick)
		// 3. effect() in onInit reacts to value() → patchState(userLogs) (needs flushEffects)
		// 4. userLogs().hasNext is now true, so loadUserNextPage() can increment userPage
		for (let i = 0; i < 5; i++) {
			await Promise.resolve();
		}
		TestBed.flushEffects();
		await Promise.resolve();

		store.loadUserNextPage();
		TestBed.flushEffects();
		await Promise.resolve();

		const req2 = httpTesting.expectOne(r => r.url.includes('/api/audit-logs'));
		expect(req2.request.params.get('page')).toBe('1');
		req2.flush({
			content: [],
			hasNext: false,
			page: 1,
			size: 20,
			first: false,
			last: true,
			numberOfElements: 0,
		});
	});
});
