import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService, StorageKey } from './local-storage.service';

// add new theme here
export enum DisplayTheme {
	LIGHT = 'LIGHT',
	DARK = 'DARK',
	BLUE_DOLPHIN = 'BLUE_DOLPHIN',
}

interface ThemeData {
	name: DisplayTheme;
	cssClass: string;
}

// add new theme's data here
export const themes: ThemeData[] = [
	{ name: DisplayTheme.LIGHT, cssClass: 'theme-light' },
	{ name: DisplayTheme.DARK, cssClass: 'theme-dark' },
	{ name: DisplayTheme.BLUE_DOLPHIN, cssClass: 'theme-blue-dolphin' },
];

@Injectable({
	providedIn: 'root',
})
export class DisplayThemeService {
	private _preference = signal<'primary' | 'secondary'>('primary');
	private _primaryTheme = signal<ThemeData>(themes.find(t => t.name === DisplayTheme.DARK)!);
	private _secondaryTheme = signal<ThemeData>(themes.find(t => t.name === DisplayTheme.BLUE_DOLPHIN)!);
	private localStorageService = inject(LocalStorageService);

	displayThemeSignal = computed<DisplayTheme>(() =>
		this._preference() === 'primary' ? this._primaryTheme().name : this._secondaryTheme().name,
	);

	preferredThemes = computed<Record<'primary' | 'secondary', ThemeData>>(() => ({
		primary: this._primaryTheme(),
		secondary: this._secondaryTheme(),
	}));

	constructor() {
		effect(() => {
			const stored = this.localStorageService.getItem(StorageKey.ThemePreference);
			this._preference.set(stored === 'secondary' ? 'secondary' : 'primary');
		});

		effect(() => {
			this.setCssClassForHtmlElement(
				this._preference() === 'primary' ? this._primaryTheme() : this._secondaryTheme(),
			);
		});
	}

	public toggleTheme(): void {
		this._preference.update(p => (p === 'primary' ? 'secondary' : 'primary'));
		this.localStorageService.setItem(StorageKey.ThemePreference, this._preference());
	}

	public setPreferredThemes(primary: DisplayTheme, secondary: DisplayTheme): void {
		const primaryTheme = themes.find(t => t.name === primary);
		const secondaryTheme = themes.find(t => t.name === secondary);
		if (primaryTheme) this._primaryTheme.set(primaryTheme);
		if (secondaryTheme) this._secondaryTheme.set(secondaryTheme);
	}

	private setCssClassForHtmlElement(themeData: ThemeData): void {
		const htmlElement = document.getElementsByTagName('html')[0];
		themes.forEach(t => htmlElement.classList.remove(t.cssClass));
		htmlElement.classList.add(themeData.cssClass);
	}
}
