import { computed, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { WorkspaceCreateRequest } from '../data-model/modules/workspaces/WorkspaceCreateRequest';
import { WorkspaceGet } from '../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceMemberEmailRequest } from '../data-model/modules/workspaces/WorkspaceMemberEmailRequest';
import { WorkspaceMemberGet } from '../data-model/modules/workspaces/WorkspaceMemberGet';
import { WorkspaceRenameRequest } from '../data-model/modules/workspaces/WorkspaceRenameRequest';
import { WorkspaceRole } from '../data-model/modules/workspaces/WorkspaceRole';
import { WorkspaceSettingsGet } from '../data-model/modules/workspaces/WorkspaceSettingsGet';
import { WorkspaceSettingsPatchRequest } from '../data-model/modules/workspaces/WorkspaceSettingsPatchRequest';
import { HttpService } from './http/http.service';
import { LocalStorageService, StorageKey } from './local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class WorkspaceService {
	private readonly http = inject(HttpService);
	private localStorageService = inject(LocalStorageService);

	private baseUrl = '/api/workspaces';

	private _workspace = signal<WorkspaceGet | null>(null);
	currentWorkspace = computed<WorkspaceGet | null>(() => this._workspace());

	setWorkspace(workspace: WorkspaceGet): void {
		this.localStorageService.setItem(StorageKey.WorkspaceId, String(workspace.id));
		this._workspace.set(workspace);
	}

	reset(): void {
		this.localStorageService.removeItem(StorageKey.WorkspaceId);
		this._workspace.set(null);
	}

	async init(defaultWorkspaceId?: number): Promise<void> {
		const workspaces = await this.list();
		const lastId = Number(this.localStorageService.getItem(StorageKey.WorkspaceId));
		const last = workspaces.find(w => w.id === lastId);
		const byDefault = defaultWorkspaceId ? workspaces.find(w => w.id === defaultWorkspaceId) : undefined;
		const workspace = last ?? byDefault ?? workspaces.find(w => w.role === WorkspaceRole.OWNER)!;
		this.setWorkspace(workspace);
	}

	public list(): Promise<WorkspaceGet[]> {
		return lastValueFrom(this.http.get<WorkspaceGet[]>(this.baseUrl));
	}

	public create(request: WorkspaceCreateRequest): Promise<WorkspaceGet> {
		return lastValueFrom(this.http.post<WorkspaceGet>(this.baseUrl, request));
	}

	public update(workspaceId: number, request: WorkspaceRenameRequest): Promise<WorkspaceGet> {
		return lastValueFrom(this.http.patch<WorkspaceGet>(`${this.baseUrl}/${workspaceId}`, request));
	}

	public delete(workspaceId: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${workspaceId}`));
	}

	public getMembers(workspaceId: number): Promise<WorkspaceMemberGet[]> {
		return lastValueFrom(this.http.get<WorkspaceMemberGet[]>(`${this.baseUrl}/${workspaceId}/members`));
	}

	public addMember(workspaceId: number, request: WorkspaceMemberEmailRequest): Promise<WorkspaceMemberGet> {
		return lastValueFrom(this.http.post<WorkspaceMemberGet>(`${this.baseUrl}/${workspaceId}/members`, request));
	}

	public removeMember(workspaceId: number, request: WorkspaceMemberEmailRequest): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${workspaceId}/members`, request));
	}

	public removeSelf(workspaceId: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${workspaceId}/members/me`));
	}

	public getSettings(): Promise<WorkspaceSettingsGet> {
		return lastValueFrom(this.http.get<WorkspaceSettingsGet>(`${this.baseUrl}/settings`));
	}

	public updateSettings(request: WorkspaceSettingsPatchRequest): Promise<WorkspaceSettingsGet> {
		return lastValueFrom(this.http.patch<WorkspaceSettingsGet>(`${this.baseUrl}/settings`, request));
	}
}
