import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { LocalStorageService, StorageKey } from '../../../../shared/local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class LanguageService {
	private readonly translocoService = inject(TranslocoService);
	private localStorageService = inject(LocalStorageService);

	language = toSignal(this.translocoService.langChanges$, {
		initialValue: this.translocoService.getActiveLang(),
	});

	constructor() {
		effect(() => {
			const stored = this.localStorageService.getItem(StorageKey.Language);
			if (stored) {
				this.translocoService.setActiveLang(stored);
			}
		});
	}

	setLanguage(lang?: string): void {
		if (!lang) return;
		this.translocoService.setActiveLang(lang);
		this.localStorageService.setItem(StorageKey.Language, lang);
	}
}
