import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { CurrencyService } from '../shared/currency.service';
import { DisplayThemeService } from '../shared/display-theme.service';
import { LanguageService } from './profile-dialog/user-settings/language-select/language.service';
import { UserSettingsService } from './profile-dialog/user-settings/user-settinngs.service';
import { CategoryStore } from './transactions-and-categories/category.store';
import { RecurringService } from './transactions-and-categories/recurring.service';
import { RecurringStore } from './transactions-and-categories/recurring.store';
import { TransactionStore } from './transactions-and-categories/transaction.store';
import { StatisticService } from './statistics/statistic.service';
import { AdminStatisticsService } from './admin/admin-statistic.service';

@Component({
	selector: 'ex-private',
	template: '<router-outlet />',
	imports: [RouterModule],
	providers: [
		TransactionStore,
		CategoryStore,
		RecurringStore,
		RecurringService,
		StatisticService,
		AdminStatisticsService,
	],
})
export class PrivateComponent {
	private readonly userSettingsService = inject(UserSettingsService);
	private readonly languageService = inject(LanguageService);
	private readonly themeService = inject(DisplayThemeService);
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);

	constructor() {
		this.userSettingsService.list().then(settings => {
			if (settings.language && settings.language !== this.translocoService.getActiveLang()) {
				this.languageService.setLanguage(settings.language);
			}

			this.themeService.setPreferredThemes(settings.primaryTheme, settings.secondaryTheme);
			this.currencyService.setBaseCurrency(settings.baseCurrency);
			this.currencyService.useBaseCurrency(settings.showBaseCurrency);
		});
	}
}
