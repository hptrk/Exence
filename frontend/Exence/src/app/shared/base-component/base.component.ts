import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SvgIcons } from '../svg-icons/svg-icons';
import { TranslationCode, TranslationCodePrefixTypes } from '../i18n/translation-types';

@Injectable({
	providedIn: 'root',
})
export abstract class BaseComponent implements OnDestroy {
	svgIcons = SvgIcons;

	private _subscriptions: Subscription[] = [];

	ngOnDestroy(): void {
		this._subscriptions.forEach(a => a.unsubscribe());
	}

	addSubscription(s: Subscription): void {
		this._subscriptions.push(s);
	}

	/**
	 * Type-safe helper to build a TranslationCode from a branch prefix and leaf suffix.
	 *
	 * @example
	 * codeFor('admin.login', 'title')        // => 'admin.login.title'
	 * codeFor('usertypes', UserTypes.ADMIN)  // => 'usertypes.ADMIN'
	 * codeFor('dashboard', 'title')          // => 'dashboard.title'
	 */

	codeFor<T extends keyof TranslationCodePrefixTypes>(
		prefix: T,
		suffix: TranslationCodePrefixTypes[T],
	): TranslationCode {
		return `${prefix}.${suffix}` as TranslationCode;
	}
}
