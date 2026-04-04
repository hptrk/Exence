import { UpperCasePipe } from '@angular/common';
import { booleanAttribute, Component, effect, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoService } from '@jsverse/transloco';

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
	imports: [MatIconModule, MatMenuModule, UpperCasePipe],
})
export class LanguageSelectComponent {
	private readonly translocoService = inject(TranslocoService);

	language = input<string | undefined>();
	menu = input(false, { transform: booleanAttribute });

	readonly changed = output<string>();

	selectedLang = signal<string>(this.translocoService.getActiveLang());

	readonly langs: string[] = this.translocoService.getAvailableLangs() as string[];

	constructor() {
		effect(() => {
			const lang = this.language();
			if (!lang) return;
			this.selectedLang.set(lang);
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
