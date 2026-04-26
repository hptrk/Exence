import { provideZonelessChangeDetection, WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Role } from '../../../app/data-model/modules/auth/Role';
import { UserGet } from '../../../app/data-model/modules/auth/UserGet';
import { DisplayTheme, DisplayThemeService, themes } from '../../../app/shared/display-theme.service';
import { LocalStorageService } from '../../../app/shared/local-storage.service';
import { CurrentUserService } from '../../../app/shared/user/current-user.service';

const BARE_KEY = 'themePreference';
const mockUser: UserGet = { id: 42, username: 'test', email: 'test@test.com', isVerified: true, role: Role.USER };

function scopedKey(userId: number): string {
	return `${userId}:themePreference`;
}

describe('DisplayThemeService', () => {
	let service: DisplayThemeService;
	let userSignal: WritableSignal<UserGet | null | undefined>;

	function create(): void {
		userSignal = signal<UserGet | null | undefined>(null);
		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				DisplayThemeService,
				LocalStorageService,
				{ provide: CurrentUserService, useValue: { user: userSignal.asReadonly() } },
			],
		});
		service = TestBed.inject(DisplayThemeService);
		TestBed.flushEffects();
	}

	afterEach(() => {
		localStorage.removeItem(BARE_KEY);
		localStorage.removeItem(scopedKey(mockUser.id));
		themes.forEach(t => document.documentElement.classList.remove(t.cssClass));
	});

	it('displayThemeSignal reflects the primary theme by default', () => {
		create();
		expect(service.displayThemeSignal()).toBe(service.preferredThemes().primary.name);
	});

	it('reads "secondary" preference from localStorage on init', () => {
		localStorage.setItem(BARE_KEY, 'secondary');
		create();
		expect(service.displayThemeSignal()).toBe(service.preferredThemes().secondary.name);
	});

	it('toggleTheme switches from primary to secondary', () => {
		create();
		const secondary = service.preferredThemes().secondary.name;
		service.toggleTheme();
		expect(service.displayThemeSignal()).toBe(secondary);
	});

	it('toggleTheme switches from secondary back to primary', () => {
		localStorage.setItem(BARE_KEY, 'secondary');
		create();
		const primary = service.preferredThemes().primary.name;
		service.toggleTheme();
		expect(service.displayThemeSignal()).toBe(primary);
	});

	it('toggleTheme persists the new preference to localStorage (bare key when unauthenticated)', () => {
		create();
		service.toggleTheme();
		expect(localStorage.getItem(BARE_KEY)).toBe('secondary');
	});

	it('toggleTheme persists to scoped key when user is set', () => {
		create();
		userSignal.set(mockUser);
		service.toggleTheme();
		expect(localStorage.getItem(scopedKey(mockUser.id))).toBe('secondary');
		expect(localStorage.getItem(BARE_KEY)).toBeNull();
	});

	it('re-reads from scoped key when user signal changes to authenticated', () => {
		localStorage.setItem(scopedKey(mockUser.id), 'secondary');
		create();
		expect(service.displayThemeSignal()).toBe(service.preferredThemes().primary.name);

		userSignal.set(mockUser);
		TestBed.flushEffects();
		expect(service.displayThemeSignal()).toBe(service.preferredThemes().secondary.name);
	});

	it('setPreferredThemes updates both primary and secondary theme data', () => {
		create();
		service.setPreferredThemes(DisplayTheme.LIGHT, DisplayTheme.DARK);
		expect(service.preferredThemes().primary.name).toBe(DisplayTheme.LIGHT);
		expect(service.preferredThemes().secondary.name).toBe(DisplayTheme.DARK);
	});

	it('setPreferredThemes updates displayThemeSignal for the active slot', () => {
		create();
		service.setPreferredThemes(DisplayTheme.LIGHT, DisplayTheme.DARK);
		expect(service.displayThemeSignal()).toBe(DisplayTheme.LIGHT);
	});

	it('the effect applies the active theme CSS class to document.documentElement', () => {
		create();
		const activeTheme = themes.find(t => t.name === service.displayThemeSignal())!;
		expect(document.documentElement.classList.contains(activeTheme.cssClass)).toBeTrue();
	});

	it('the effect updates the CSS class when theme is toggled', () => {
		create();
		const previousClass = themes.find(t => t.name === service.displayThemeSignal())!.cssClass;
		service.toggleTheme();
		TestBed.flushEffects();
		const newClass = themes.find(t => t.name === service.displayThemeSignal())!.cssClass;
		expect(document.documentElement.classList.contains(newClass)).toBeTrue();
		expect(document.documentElement.classList.contains(previousClass)).toBeFalse();
	});
});
