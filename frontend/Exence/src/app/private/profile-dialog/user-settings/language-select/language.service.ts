import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
	providedIn: 'root',
})
export class LanguageService {
	private readonly translocoService = inject(TranslocoService);

	language = toSignal(this.translocoService.langChanges$, {
		initialValue: this.translocoService.getActiveLang(),
	});

	constructor() {
		const stored = localStorage.getItem('language');
		if (stored) {
			this.translocoService.setActiveLang(stored);
		}
	}

	setLanguage(lang?: string): void {
		if (!lang) return;
		this.translocoService.setActiveLang(lang);
		localStorage.setItem('language', lang);
	}
}
