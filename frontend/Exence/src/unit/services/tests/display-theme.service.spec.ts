import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DisplayTheme, DisplayThemeService, themes } from '../../../app/shared/display-theme.service';

const STORAGE_KEY = 'themePreference';

describe('DisplayThemeService', () => {
	let service: DisplayThemeService;

	function create(): void {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection(), DisplayThemeService],
		});
		service = TestBed.inject(DisplayThemeService);
		TestBed.flushEffects();
	}

	afterEach(() => {
		localStorage.removeItem(STORAGE_KEY);
		themes.forEach(t => document.documentElement.classList.remove(t.cssClass));
	});

	it('displayThemeSignal reflects the primary theme by default', () => {
		create();
		expect(service.displayThemeSignal()).toBe(service.preferredThemes().primary.name);
	});

	it('reads "secondary" preference from localStorage on init', () => {
		localStorage.setItem(STORAGE_KEY, 'secondary');
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
		localStorage.setItem(STORAGE_KEY, 'secondary');
		create();
		const primary = service.preferredThemes().primary.name;
		service.toggleTheme();
		expect(service.displayThemeSignal()).toBe(primary);
	});

	it('toggleTheme persists the new preference to localStorage', () => {
		create();
		service.toggleTheme();
		expect(localStorage.getItem(STORAGE_KEY)).toBe('secondary');
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
