import { provideZonelessChangeDetection, WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Role } from '../../../app/data-model/modules/auth/Role';
import { UserGet } from '../../../app/data-model/modules/auth/UserGet';
import { LocalStorageService, StorageKey } from '../../../app/shared/local-storage.service';
import { CurrentUserService } from '../../../app/shared/user/current-user.service';

const mockUser: UserGet = { id: 42, username: 'test', email: 'test@test.com', isVerified: true, role: Role.USER };

describe('LocalStorageService', () => {
	let service: LocalStorageService;
	let userSignal: WritableSignal<UserGet | null | undefined>;

	function create(): void {
		userSignal = signal<UserGet | null | undefined>(null);
		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				LocalStorageService,
				{ provide: CurrentUserService, useValue: { user: userSignal.asReadonly() } },
			],
		});
		service = TestBed.inject(LocalStorageService);
	}

	afterEach(() => {
		Object.values(StorageKey).forEach(key => {
			localStorage.removeItem(key);
			localStorage.removeItem(`${mockUser.id}:${key}`);
		});
	});

	describe('unauthenticated (user is null)', () => {
		beforeEach(() => create());

		it('getItem returns null when key is absent', () => {
			expect(service.getItem(StorageKey.Language)).toBeNull();
		});

		it('setItem writes to the bare key', () => {
			service.setItem(StorageKey.Language, 'en');
			expect(localStorage.getItem('language')).toBe('en');
		});

		it('getItem reads from the bare key', () => {
			localStorage.setItem('language', 'hu');
			expect(service.getItem(StorageKey.Language)).toBe('hu');
		});

		it('removeItem removes the bare key', () => {
			localStorage.setItem('language', 'hu');
			service.removeItem(StorageKey.Language);
			expect(localStorage.getItem('language')).toBeNull();
		});

		it('setItem writes bare key for all StorageKey values', () => {
			service.setItem(StorageKey.ThemePreference, 'secondary');
			service.setItem(StorageKey.WorkspaceId, '7');
			expect(localStorage.getItem('themePreference')).toBe('secondary');
			expect(localStorage.getItem('workspaceId')).toBe('7');
		});
	});

	describe('authenticated (user is set)', () => {
		beforeEach(() => {
			create();
			userSignal.set(mockUser);
		});

		it('setItem writes to the scoped key', () => {
			service.setItem(StorageKey.Language, 'en');
			expect(localStorage.getItem(`${mockUser.id}:language`)).toBe('en');
			expect(localStorage.getItem('language')).toBeNull();
		});

		it('getItem reads from the scoped key', () => {
			localStorage.setItem(`${mockUser.id}:language`, 'fr');
			expect(service.getItem(StorageKey.Language)).toBe('fr');
		});

		it('getItem does not fall through to bare key', () => {
			localStorage.setItem('language', 'en');
			expect(service.getItem(StorageKey.Language)).toBeNull();
		});

		it('removeItem removes the scoped key', () => {
			localStorage.setItem(`${mockUser.id}:language`, 'fr');
			service.removeItem(StorageKey.Language);
			expect(localStorage.getItem(`${mockUser.id}:language`)).toBeNull();
		});

		it('setItem writes to scoped key for all StorageKey values', () => {
			service.setItem(StorageKey.ThemePreference, 'secondary');
			service.setItem(StorageKey.WorkspaceId, '7');
			expect(localStorage.getItem(`${mockUser.id}:themePreference`)).toBe('secondary');
			expect(localStorage.getItem(`${mockUser.id}:workspaceId`)).toBe('7');
		});
	});

	describe('transition: user logs in after service creation', () => {
		beforeEach(() => create());

		it('switches from bare key to scoped key after user is set', () => {
			service.setItem(StorageKey.Language, 'en');
			expect(localStorage.getItem('language')).toBe('en');

			userSignal.set(mockUser);

			service.setItem(StorageKey.Language, 'fr');
			expect(localStorage.getItem(`${mockUser.id}:language`)).toBe('fr');
			expect(localStorage.getItem('language')).toBe('en');
		});

		it('getItem switches to scoped key after user is set', () => {
			localStorage.setItem('language', 'en');
			localStorage.setItem(`${mockUser.id}:language`, 'fr');

			expect(service.getItem(StorageKey.Language)).toBe('en');

			userSignal.set(mockUser);
			expect(service.getItem(StorageKey.Language)).toBe('fr');
		});
	});
});
