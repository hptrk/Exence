import { computed, effect, Injectable, signal } from '@angular/core';

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
	private readonly _preference = signal<'primary' | 'secondary'>(this.getInitialPreference());
	private readonly _primaryTheme = signal<ThemeData>(themes.find(t => t.name === DisplayTheme.DARK)!);
	private readonly _secondaryTheme = signal<ThemeData>(themes.find(t => t.name === DisplayTheme.BLUE_DOLPHIN)!);

	displayThemeSignal = computed<DisplayTheme>(() =>
		this._preference() === 'primary' ? this._primaryTheme().name : this._secondaryTheme().name,
	);

	preferredThemes = computed<Record<'primary' | 'secondary', ThemeData>>(() => ({
		primary: this._primaryTheme(),
		secondary: this._secondaryTheme(),
	}));

	constructor() {
		effect(() => {
			this.setCssClassForHtmlElement(
				this._preference() === 'primary' ? this._primaryTheme() : this._secondaryTheme(),
			);
		});
	}

	public toggleTheme(): void {
		this._preference.update(p => (p === 'primary' ? 'secondary' : 'primary'));
		localStorage.setItem('themePreference', this._preference());
	}

	public setPreferredThemes(primary: DisplayTheme, secondary: DisplayTheme): void {
		const primaryTheme = themes.find(t => t.name === primary);
		const secondaryTheme = themes.find(t => t.name === secondary);
		if (primaryTheme) this._primaryTheme.set(primaryTheme);
		if (secondaryTheme) this._secondaryTheme.set(secondaryTheme);
	}

	private getInitialPreference(): 'primary' | 'secondary' {
		return localStorage.getItem('themePreference') === 'secondary' ? 'secondary' : 'primary';
	}

	private setCssClassForHtmlElement(themeData: ThemeData): void {
		const htmlElement = document.getElementsByTagName('html')[0];
		themes.forEach(t => htmlElement.classList.remove(t.cssClass));
		htmlElement.classList.add(themeData.cssClass);
	}
}
