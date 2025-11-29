import { Injectable, signal, WritableSignal } from '@angular/core';

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
	readonly displayThemeSignal: WritableSignal<DisplayTheme> = signal(this.getInitialTheme().name);

	private _preferredThemes: Record<'primary' | 'secondary', ThemeData> = {
		primary: themes.find(t => t.name === DisplayTheme.DARK)!,
		secondary: themes.find(t => t.name === DisplayTheme.BLUE_DOLPHIN)!,
	};

	get currentTheme(): DisplayTheme {
		return this.displayThemeSignal();
	}
	get preferredThemes(): Record<'primary' | 'secondary', ThemeData> {
		return this._preferredThemes;
	}

	constructor() {
		let themeData = this.getInitialTheme();
		this.setCssClassForHtmlElement(themeData);
	}

	public toggleTheme(): void {
		const currentTheme = this.displayThemeSignal();
		const preferredThemes = this._preferredThemes;
		const currentIsPreferred = !!Object.values(preferredThemes).find(themeData => themeData.name === currentTheme);

		if (currentIsPreferred && currentTheme === preferredThemes.primary.name) {
			this.setTheme(preferredThemes.secondary.name);
		} else {
			this.setTheme(preferredThemes.primary.name);
		}
	}

	// used later in profile settings
	public setPreferredThemes(primary: DisplayTheme, secondary: DisplayTheme) {
		// will be implemented with a mat-select so it can't be anything else
		this._preferredThemes.primary = themes.find(t => t.name === primary)!;
		this._preferredThemes.secondary = themes.find(t => t.name === secondary)!;
	}

	public setInitialTheme(): void {
		let theme = this.getInitialTheme();
		this.setTheme(theme.name, false);
	}

	private setTheme(theme: DisplayTheme, shouldSave = true): void {
		let themeData = this.getThemeDataByName(theme);
		if (themeData) {
			if (shouldSave) localStorage.setItem('displayTheme', themeData.name);
			this.setCssClassForHtmlElement(themeData);
			this.displayThemeSignal.set(themeData.name);
		}
	}

	private getInitialTheme(): ThemeData {
		const preference = localStorage.getItem('displayTheme') as DisplayTheme | null;
		return this.getThemeDataByName(preference) ?? this.getDefaultThemeData();
	}

	private setCssClassForHtmlElement(themeData: ThemeData): void {
		const htmlElement = document.getElementsByTagName('html')[0];
		themes.forEach(t => htmlElement.classList.remove(t.cssClass));
		htmlElement.classList.add(themeData.cssClass);
	}

	private getThemeDataByName(name: DisplayTheme | null): ThemeData | null {
		return themes.find(a => a.name === name) ?? null;
	}

	private getDefaultThemeData(): ThemeData {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		return this.getThemeDataByName(prefersDark ? DisplayTheme.DARK : DisplayTheme.LIGHT)!;
	}
}
