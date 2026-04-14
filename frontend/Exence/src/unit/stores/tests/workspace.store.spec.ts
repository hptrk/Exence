import { Signal, WritableSignal, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WorkspaceGet } from '../../../app/data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceRole } from '../../../app/data-model/modules/workspaces/WorkspaceRole';
import { WorkspaceCreateRequest } from '../../../app/data-model/modules/workspaces/WorkspaceCreateRequest';
import { WorkspaceRenameRequest } from '../../../app/data-model/modules/workspaces/WorkspaceRenameRequest';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { WorkspaceSettingsStore } from '../../../app/private/profile-dialog/workspace-settings/workspace.store';
import { WorkspaceService } from '../../../app/shared/workspace.service';

// Fixtures
const mockWorkspace: WorkspaceGet = { id: 1, name: 'My Workspace', role: WorkspaceRole.OWNER };
const mockWorkspace2: WorkspaceGet = { id: 2, name: 'Other Workspace', role: WorkspaceRole.MEMBER };

const createRequest: WorkspaceCreateRequest = { name: 'New Workspace', baseCurrency: SupportedCurrency.EUR };
const renameRequest: WorkspaceRenameRequest = { name: 'Renamed Workspace' };

// WorkspaceSettingsStore
describe('WorkspaceSettingsStore', () => {
	let store: InstanceType<typeof WorkspaceSettingsStore>;
	let mockWorkspaceService: jasmine.SpyObj<WorkspaceService> & { currentWorkspace: Signal<WorkspaceGet | null> };
	let mockCurrentWorkspace: WritableSignal<WorkspaceGet | null>;

	async function waitForResource(): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, 0));
		TestBed.flushEffects();
	}

	beforeEach(() => {
		mockCurrentWorkspace = signal<WorkspaceGet | null>(null);

		const spyObj = jasmine.createSpyObj<WorkspaceService>('WorkspaceService', [
			'list',
			'create',
			'update',
			'delete',
			'setWorkspace',
		]);
		spyObj.list.and.resolveTo([mockWorkspace]);
		spyObj.create.and.resolveTo(mockWorkspace2);
		spyObj.update.and.resolveTo(mockWorkspace);
		spyObj.delete.and.resolveTo(undefined as unknown as void);
		spyObj.setWorkspace.and.callFake((ws: WorkspaceGet) => mockCurrentWorkspace.set(ws));

		mockWorkspaceService = Object.assign(spyObj, {
			currentWorkspace: mockCurrentWorkspace.asReadonly(),
		});

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				WorkspaceSettingsStore,
				{ provide: WorkspaceService, useValue: mockWorkspaceService },
			],
		});

		store = TestBed.inject(WorkspaceSettingsStore);
	});

	// workspacesResource
	describe('workspacesResource', () => {
		it('populates workspaces from the service on init', async () => {
			await waitForResource();
			expect(store.workspaces()).toEqual([mockWorkspace]);
		});
	});

	// createWorkspace
	describe('createWorkspace', () => {
		it('calls workspaceService.create with the request', async () => {
			await store.createWorkspace(createRequest);
			expect(mockWorkspaceService.create).toHaveBeenCalledOnceWith(createRequest);
		});

		it('appends the created workspace to the list', async () => {
			await waitForResource();
			await store.createWorkspace(createRequest);
			expect(store.workspaces()).toContain(mockWorkspace2);
		});

		it('switches to the newly created workspace', async () => {
			await store.createWorkspace(createRequest);
			expect(mockWorkspaceService.setWorkspace).toHaveBeenCalledWith(mockWorkspace2);
		});

		it('returns the created workspace', async () => {
			const result = await store.createWorkspace(createRequest);
			expect(result).toEqual(mockWorkspace2);
		});
	});

	// updateWorkspace
	describe('updateWorkspace', () => {
		it('calls workspaceService.update with id and request', async () => {
			await store.updateWorkspace(mockWorkspace.id, renameRequest);
			expect(mockWorkspaceService.update).toHaveBeenCalledOnceWith(mockWorkspace.id, renameRequest);
		});

		it('updates the workspace name in the list', async () => {
			await waitForResource();
			await store.updateWorkspace(mockWorkspace.id, renameRequest);
			expect(store.workspaces().find(w => w.id === mockWorkspace.id)?.name).toBe(renameRequest.name);
		});

		it('syncs currentWorkspace when the active workspace is renamed', async () => {
			mockCurrentWorkspace.set(mockWorkspace);
			await store.updateWorkspace(mockWorkspace.id, renameRequest);
			expect(mockWorkspaceService.setWorkspace).toHaveBeenCalledWith({
				...mockWorkspace,
				name: renameRequest.name,
			});
		});

		it('does not update currentWorkspace when a different workspace is renamed', async () => {
			mockCurrentWorkspace.set(mockWorkspace2);
			await store.updateWorkspace(mockWorkspace.id, renameRequest);
			expect(mockWorkspaceService.setWorkspace).not.toHaveBeenCalled();
		});
	});

	// deleteWorkspace
	describe('deleteWorkspace', () => {
		it('calls workspaceService.delete with the id', async () => {
			await store.deleteWorkspace(mockWorkspace.id);
			expect(mockWorkspaceService.delete).toHaveBeenCalledOnceWith(mockWorkspace.id);
		});

		it('removes the workspace from the list', async () => {
			await waitForResource();
			await store.deleteWorkspace(mockWorkspace.id);
			expect(store.workspaces().find(w => w.id === mockWorkspace.id)).toBeUndefined();
		});
	});

	// removeWorkspaceFromList
	describe('removeWorkspaceFromList', () => {
		it('removes the workspace from the list without an API call', async () => {
			await waitForResource();
			store.removeWorkspaceFromList(mockWorkspace.id);
			expect(store.workspaces().find(w => w.id === mockWorkspace.id)).toBeUndefined();
			expect(mockWorkspaceService.delete).not.toHaveBeenCalled();
		});
	});
});
