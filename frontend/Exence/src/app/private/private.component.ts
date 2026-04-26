import { Component, effect, inject, untracked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { CurrencyService } from '../shared/currency.service';
import { DisplayThemeService } from '../shared/display-theme.service';
import { DialogService } from '../shared/dialog/dialog.service';
import { ExchangeRateService } from '../shared/exchange-rate.service';
import { LanguageService } from './profile-dialog/user-settings/language-select/language.service';
import { UserSettingsService } from './profile-dialog/user-settings/user-settinngs.service';
import { WorkspaceService } from '../shared/workspace.service';
import { CategoryService } from './transactions-and-categories/category.service';
import { CategoryStore } from './transactions-and-categories/category.store';
import { RecurringService } from './transactions-and-categories/recurring.service';
import { RecurringStore } from './transactions-and-categories/recurring.store';
import { TransactionService } from './transactions-and-categories/transaction.service';
import { TransactionStore } from './transactions-and-categories/transaction.store';
import { StatisticService } from './statistics/statistic.service';
import { AdminStatisticsService } from './admin/admin-statistic.service';
import { GoalService } from './goals/goal.service';
import { GoalStore } from './goals/goal.store';
import { DebtService } from './debts/debt.service';
import { DebtStore } from './debts/debt.store';
import { InvestmentService } from './investments/investment.service';
import { InvestmentStore } from './investments/investment.store';

@Component({
	selector: 'ex-private',
	template: '<router-outlet />',
	styles: `
		:host {
			display: block;
			height: 100%;
		}
	`,
	imports: [RouterModule],
	providers: [
		TransactionStore,
		CategoryStore,
		RecurringStore,
		RecurringService,
		StatisticService,
		AdminStatisticsService,
		GoalService,
		GoalStore,
		DebtService,
		DebtStore,
		InvestmentService,
		InvestmentStore,
		DialogService,
		CategoryService,
		TransactionService,
		ExchangeRateService,
	],
})
export class PrivateComponent {
	private readonly userSettingsService = inject(UserSettingsService);
	private readonly languageService = inject(LanguageService);
	private readonly themeService = inject(DisplayThemeService);
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);

	private readonly workspaceService = inject(WorkspaceService);

	constructor() {
		this.userSettingsService.list().then(settings => {
			if (settings.language && settings.language !== this.translocoService.getActiveLang()) {
				this.languageService.setLanguage(settings.language);
			}

			this.themeService.setPreferredThemes(settings.primaryTheme, settings.secondaryTheme);
		});

		effect(() => {
			this.workspaceService.currentWorkspace(); // tracked - runs on every workspace switch
			untracked(() => {
				this.workspaceService.getSettings().then(settings => {
					this.currencyService.setBaseCurrency(settings.baseCurrency);
					this.currencyService.useBaseCurrency(settings.showBaseCurrency);
				});
			});
		});
	}
}
