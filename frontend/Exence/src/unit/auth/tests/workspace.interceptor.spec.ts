import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WorkspaceGet } from '../../../app/data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceRole } from '../../../app/data-model/modules/workspaces/WorkspaceRole';
import { workspaceInterceptor } from '../../../app/shared/auth/interceptors/workspace.interceptor';
import { CurrentUserService } from '../../../app/shared/user/current-user.service';
import { WorkspaceService } from '../../../app/shared/workspace.service';

const mockWorkspace: WorkspaceGet = { id: 42, name: 'My Workspace', role: WorkspaceRole.OWNER };

describe('workspaceInterceptor', () => {
	let http: HttpClient;
	let httpMock: HttpTestingController;
	let mockCurrentUserService: { isAuthenticated: jasmine.Spy };
	let mockCurrentWorkspace: ReturnType<typeof signal<WorkspaceGet | null>>;

	beforeEach(() => {
		mockCurrentWorkspace = signal<WorkspaceGet | null>(null);
		mockCurrentUserService = { isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true) };

		const mockWorkspaceService: { currentWorkspace: Signal<WorkspaceGet | null> } = {
			currentWorkspace: mockCurrentWorkspace.asReadonly(),
		};

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([workspaceInterceptor])),
				provideHttpClientTesting(),
				{ provide: CurrentUserService, useValue: mockCurrentUserService },
				{ provide: WorkspaceService, useValue: mockWorkspaceService },
			],
		});

		http = TestBed.inject(HttpClient);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpMock.verify());

	it('adds X-Workspace-ID header when authenticated and workspace is set', () => {
		mockCurrentWorkspace.set(mockWorkspace);

		http.get('/api/items').subscribe();

		const req = httpMock.expectOne('/api/items');
		expect(req.request.headers.get('X-Workspace-ID')).toBe(String(mockWorkspace.id));
		req.flush({});
	});

	it('does not add X-Workspace-ID header when not authenticated', () => {
		mockCurrentUserService.isAuthenticated.and.returnValue(false);
		mockCurrentWorkspace.set(mockWorkspace);

		http.get('/api/items').subscribe();

		const req = httpMock.expectOne('/api/items');
		expect(req.request.headers.has('X-Workspace-ID')).toBeFalse();
		req.flush({});
	});

	it('does not add X-Workspace-ID header when no workspace is set', () => {
		mockCurrentWorkspace.set(null);

		http.get('/api/items').subscribe();

		const req = httpMock.expectOne('/api/items');
		expect(req.request.headers.has('X-Workspace-ID')).toBeFalse();
		req.flush({});
	});
});
