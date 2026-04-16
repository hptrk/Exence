import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { WorkspaceCreateRequest } from '../../../app/data-model/modules/workspaces/WorkspaceCreateRequest';
import { WorkspaceGet } from '../../../app/data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceMemberEmailRequest } from '../../../app/data-model/modules/workspaces/WorkspaceMemberEmailRequest';
import { WorkspaceMemberGet } from '../../../app/data-model/modules/workspaces/WorkspaceMemberGet';
import { WorkspaceRenameRequest } from '../../../app/data-model/modules/workspaces/WorkspaceRenameRequest';
import { WorkspaceRole } from '../../../app/data-model/modules/workspaces/WorkspaceRole';
import { WorkspaceSettingsGet } from '../../../app/data-model/modules/workspaces/WorkspaceSettingsGet';
import { WorkspaceSettingsPatchRequest } from '../../../app/data-model/modules/workspaces/WorkspaceSettingsPatchRequest';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { HttpService } from '../../../app/shared/http/http.service';
import { WorkspaceService } from '../../../app/shared/workspace.service';

// Fixtures
const mockWorkspaceOwner: WorkspaceGet = { id: 1, name: 'My Workspace', role: WorkspaceRole.OWNER };
const mockWorkspaceMember: WorkspaceGet = { id: 2, name: 'Shared Workspace', role: WorkspaceRole.MEMBER };
const mockMember: WorkspaceMemberGet = {
	userId: 10,
	username: 'alice',
	email: 'alice@example.com',
	role: WorkspaceRole.MEMBER,
	joinedAt: new Date('2024-01-01T00:00:00Z'),
};
const mockSettings: WorkspaceSettingsGet = { baseCurrency: SupportedCurrency.EUR, showBaseCurrency: true };
const createRequest: WorkspaceCreateRequest = { name: 'New', baseCurrency: SupportedCurrency.USD };
const renameRequest: WorkspaceRenameRequest = { name: 'Renamed' };
const memberEmailRequest: WorkspaceMemberEmailRequest = { email: 'alice@example.com' };
const settingsRequest: WorkspaceSettingsPatchRequest = { baseCurrency: SupportedCurrency.GBP, showBaseCurrency: false };
const STORAGE_KEY = 'workspaceId';

describe('WorkspaceService', () => {
	let service: WorkspaceService;
	let mockHttp: jasmine.SpyObj<HttpService>;

	beforeEach(() => {
		mockHttp = jasmine.createSpyObj<HttpService>('HttpService', ['get', 'post', 'patch', 'delete']);

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				WorkspaceService,
				{ provide: HttpService, useValue: mockHttp },
			],
		});

		service = TestBed.inject(WorkspaceService);
		localStorage.removeItem(STORAGE_KEY);
	});

	afterEach(() => localStorage.removeItem(STORAGE_KEY));

	// list
	describe('list', () => {
		it('calls GET /api/workspaces', async () => {
			mockHttp.get.and.returnValue(of([mockWorkspaceOwner]));
			const result = await service.list();
			expect(mockHttp.get).toHaveBeenCalledOnceWith('/api/workspaces');
			expect(result).toEqual([mockWorkspaceOwner]);
		});
	});

	// create
	describe('create', () => {
		it('calls POST /api/workspaces with the request body', async () => {
			mockHttp.post.and.returnValue(of(mockWorkspaceOwner));
			const result = await service.create(createRequest);
			expect(mockHttp.post).toHaveBeenCalledOnceWith('/api/workspaces', createRequest);
			expect(result).toEqual(mockWorkspaceOwner);
		});
	});

	// update
	describe('update', () => {
		it('calls PATCH /api/workspaces/:id with the request body', async () => {
			mockHttp.patch.and.returnValue(of(mockWorkspaceOwner));
			const result = await service.update(1, renameRequest);
			expect(mockHttp.patch).toHaveBeenCalledOnceWith('/api/workspaces/1', renameRequest);
			expect(result).toEqual(mockWorkspaceOwner);
		});
	});

	// delete
	describe('delete', () => {
		it('calls DELETE /api/workspaces/:id', async () => {
			mockHttp.delete.and.returnValue(of(undefined));
			await service.delete(1);
			expect(mockHttp.delete).toHaveBeenCalledOnceWith('/api/workspaces/1');
		});
	});

	// getMembers
	describe('getMembers', () => {
		it('calls GET /api/workspaces/:id/members', async () => {
			mockHttp.get.and.returnValue(of([mockMember]));
			const result = await service.getMembers(1);
			expect(mockHttp.get).toHaveBeenCalledOnceWith('/api/workspaces/1/members');
			expect(result).toEqual([mockMember]);
		});
	});

	// addMember
	describe('addMember', () => {
		it('calls POST /api/workspaces/:id/members with the request body', async () => {
			mockHttp.post.and.returnValue(of(mockMember));
			const result = await service.addMember(1, memberEmailRequest);
			expect(mockHttp.post).toHaveBeenCalledOnceWith('/api/workspaces/1/members', memberEmailRequest);
			expect(result).toEqual(mockMember);
		});
	});

	// removeMember
	describe('removeMember', () => {
		it('calls DELETE /api/workspaces/:id/members with the request body', async () => {
			mockHttp.delete.and.returnValue(of(undefined));
			await service.removeMember(1, memberEmailRequest);
			expect(mockHttp.delete).toHaveBeenCalledOnceWith('/api/workspaces/1/members', memberEmailRequest);
		});
	});

	// removeSelf
	describe('removeSelf', () => {
		it('calls DELETE /api/workspaces/:id/members/me', async () => {
			mockHttp.delete.and.returnValue(of(undefined));
			await service.removeSelf(1);
			expect(mockHttp.delete).toHaveBeenCalledOnceWith('/api/workspaces/1/members/me');
		});
	});

	// getSettings
	describe('getSettings', () => {
		it('calls GET /api/workspaces/settings', async () => {
			mockHttp.get.and.returnValue(of(mockSettings));
			const result = await service.getSettings();
			expect(mockHttp.get).toHaveBeenCalledOnceWith('/api/workspaces/settings');
			expect(result).toEqual(mockSettings);
		});
	});

	// updateSettings
	describe('updateSettings', () => {
		it('calls PATCH /api/workspaces/settings with the request body', async () => {
			mockHttp.patch.and.returnValue(of(mockSettings));
			const result = await service.updateSettings(settingsRequest);
			expect(mockHttp.patch).toHaveBeenCalledOnceWith('/api/workspaces/settings', settingsRequest);
			expect(result).toEqual(mockSettings);
		});
	});

	// setWorkspace / currentWorkspace
	describe('setWorkspace', () => {
		it('updates the currentWorkspace signal', () => {
			service.setWorkspace(mockWorkspaceOwner);
			expect(service.currentWorkspace()).toEqual(mockWorkspaceOwner);
		});

		it('persists the workspace id to localStorage', () => {
			service.setWorkspace(mockWorkspaceOwner);
			expect(localStorage.getItem(STORAGE_KEY)).toBe(String(mockWorkspaceOwner.id));
		});
	});

	// reset
	describe('reset', () => {
		it('clears the currentWorkspace signal', () => {
			service.setWorkspace(mockWorkspaceOwner);
			service.reset();
			expect(service.currentWorkspace()).toBeNull();
		});

		it('removes the workspace id from localStorage', () => {
			service.setWorkspace(mockWorkspaceOwner);
			service.reset();
			expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
		});
	});

	// init
	describe('init', () => {
		beforeEach(() => {
			mockHttp.get.and.returnValue(of([mockWorkspaceOwner, mockWorkspaceMember]));
		});

		it('selects the workspace stored in localStorage', async () => {
			localStorage.setItem(STORAGE_KEY, String(mockWorkspaceMember.id));
			await service.init();
			expect(service.currentWorkspace()).toEqual(mockWorkspaceMember);
		});

		it('falls back to the defaultWorkspaceId when localStorage has no entry', async () => {
			await service.init(mockWorkspaceMember.id);
			expect(service.currentWorkspace()).toEqual(mockWorkspaceMember);
		});

		it('falls back to the OWNER workspace when localStorage and defaultWorkspaceId are not set', async () => {
			await service.init();
			expect(service.currentWorkspace()).toEqual(mockWorkspaceOwner);
		});

		it('prefers localStorage over defaultWorkspaceId', async () => {
			localStorage.setItem(STORAGE_KEY, String(mockWorkspaceOwner.id));
			await service.init(mockWorkspaceMember.id);
			expect(service.currentWorkspace()).toEqual(mockWorkspaceOwner);
		});
	});
});
