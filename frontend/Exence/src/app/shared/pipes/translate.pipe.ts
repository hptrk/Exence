import { Pipe, PipeTransform } from '@angular/core';
import { TranslationCode } from '../i18n/translation-types';
import { TranslocoPipe } from '@jsverse/transloco';

/**
 * Type-safe wrapper around TranslocoPipe.
 * Constrains the key parameter to TranslationCode, providing
 * compile-time errors on typos and IDE autocomplete for valid translation keys.
 *
 * Usage in templates:
 *   {{ 'dashboard.title' | translate }}
 *   {{ codeFor('dashboard', 'title') | translate }}
 */
@Pipe({
	name: 'translate',
	pure: false,
})
export class TranslatePipe extends TranslocoPipe implements PipeTransform {
	override transform(key: TranslationCode, params?: Record<string, unknown>): string {
		return super.transform(key as string, params);
	}
}
