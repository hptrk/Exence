import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export enum DisplayTheme {
	DARK = 'DARK',
	LIGHT = 'LIGHT'
}

interface ThemeData {
	name: DisplayTheme;
	cssClass: string;
}

@Injectable({
	providedIn: 'root',
})
export class DisplayThemeService {
	private _displayTheme: BehaviorSubject<DisplayTheme>;
	readonly displayTheme$: Observable<DisplayTheme>;
	readonly isDark$: Observable<boolean>;

	get currentTheme(): DisplayTheme { return this._displayTheme.value; }

	private readonly themes: ThemeData[] = [
		{ name: DisplayTheme.LIGHT, cssClass: 'theme-light' },
		{ name: DisplayTheme.DARK, cssClass: 'theme-dark' }
	];

	constructor() {
		let themeData = this.getInitialTheme();

		this.setCssClass(themeData);

		this._displayTheme = new BehaviorSubject(themeData.name);
		this.displayTheme$ = this._displayTheme.asObservable();
		this.isDark$ = this.displayTheme$.pipe(map(a => a === DisplayTheme.DARK));
	}

	private getInitialTheme(): ThemeData {
		let preference = localStorage.getItem('displayTheme') as (DisplayTheme | undefined | null);
		return this.getThemeDataByName(preference) || this.getDefaultThemeData();
	}

	public setInitialTheme(): void {
		let theme = this.getInitialTheme();
		this.setTheme(theme.name, false);
	}

	public clearTheme(): void {
		this.setCssClass();
	}

	public setTheme(theme: DisplayTheme, shouldSave = true): void {
		let themeData = this.getThemeDataByName(theme);
		if (themeData) {
			if (shouldSave) localStorage.setItem('displayTheme', themeData.name);
			this.setCssClass(themeData);
			this._displayTheme.next(themeData.name);
		}
	}

	private setCssClass(themeData?: ThemeData): void {
		let htmlElement = document.getElementsByTagName('html')[0];
		if (!htmlElement) {
			console.error('Couldn\'t set theme, no htmlElement');
			return;
		}

		for (let t of this.themes) {
			if (t.cssClass)
				htmlElement.classList.remove(t.cssClass);
		}

		if (themeData?.cssClass)
			htmlElement.classList.add(themeData.cssClass);
	}

	private getThemeDataByName(name: DisplayTheme | undefined | null): ThemeData | undefined {
		return this.themes.find(a => a.name === name);
	}

	private getDefaultThemeData(): ThemeData {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		return this.getThemeDataByName(prefersDark ? DisplayTheme.DARK : DisplayTheme.LIGHT)!;
	}
}
