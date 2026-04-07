import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

function formatOrdinal(value: number, locale: string): string {
	switch (locale) {
		case 'en': {
			const rules = new Intl.PluralRules('en', { type: 'ordinal' });
			const suffixes: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
			return `${value}${suffixes[rules.select(value)]}`;
		}
		case 'fr':
			return value === 1 ? `1er` : `${value}e`;
		case 'es':
			return `${value}.º`;
		case 'it':
			return `${value}°`;
		default: // hu, de, pl, sk
			return `${value}.`;
	}
}

@Pipe({ name: 'ordinal', pure: false })
export class OrdinalPipe implements PipeTransform {
	private readonly translocoService = inject(TranslocoService);

	transform(value: number): string {
		const lang = this.translocoService.getActiveLang();
		return formatOrdinal(value, lang);
	}
}
