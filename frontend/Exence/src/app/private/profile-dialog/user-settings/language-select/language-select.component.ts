import { UpperCasePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

const LANG_LABELS: Record<string, string> = {
	hu: 'Magyar',
	en: 'English',
	de: 'Deutsch',
	es: 'Español',
	fr: 'Français',
	it: 'Italiano',
	pl: 'Polski',
	sk: 'Slovenčina',
};

@Component({
	selector: 'ex-language-select',
	templateUrl: './language-select.component.html',
	styleUrl: './language-select.component.scss',
	imports: [MatIconModule, UpperCasePipe, TranslatePipe],
})
export class LanguageSelectComponent {
	private readonly translocoService = inject(TranslocoService);

	initialLang = input<{ lang: string } | null | undefined>();

	readonly changed = output<string>();

	selectedLang = signal<string>(this.translocoService.getActiveLang());

	readonly langs: string[] = this.translocoService.getAvailableLangs() as string[];

	constructor() {
		effect(() => {
			const wrapper = this.initialLang();
			if (wrapper?.lang != null) this.selectedLang.set(wrapper.lang);
		});
	}

	selectLang(lang: string): void {
		this.selectedLang.set(lang);
		this.changed.emit(lang);
	}

	getLanguage(lang: string): string {
		return LANG_LABELS[lang];
	}
}
