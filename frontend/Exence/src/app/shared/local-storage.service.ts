import { inject, Injectable } from '@angular/core';
import { CurrentUserService } from './user/current-user.service';

export enum StorageKey {
	ThemePreference = 'themePreference',
	WorkspaceId = 'workspaceId',
	Language = 'language',
}

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private currentUserService = inject(CurrentUserService);

	getItem(key: StorageKey): string | null {
		return localStorage.getItem(this.buildKey(key));
	}

	setItem(key: StorageKey, value: string): void {
		localStorage.setItem(this.buildKey(key), value);
	}

	removeItem(key: StorageKey): void {
		localStorage.removeItem(this.buildKey(key));
	}

	private buildKey(key: StorageKey): string {
		const user = this.currentUserService.user();
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		return user?.id != null ? `${user.id}:${key}` : key;
	}
}
