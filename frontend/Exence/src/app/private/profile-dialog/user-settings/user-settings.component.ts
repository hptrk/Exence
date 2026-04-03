import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoService } from '@jsverse/transloco';
import { UpdateUserSettingsRequest } from '../../../data-model/modules/user-settings/UpdateUserSettingsRequest';
import { UserSettingsResponse } from '../../../data-model/modules/user-settings/UserSettingsResponse';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { LanguageService } from './language-select/language.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ThemeData, ThemeSelectComponent } from './theme-select/theme-select.component';
import { UserSettingsService } from './user-settinngs.service';
import { ConfirmExitService } from '../../../shared/confirm-exit.service';
import { DialogRef } from '../../../shared/dialog/dialog.service';
import { LanguageSelectComponent } from './language-select/language-select.component';
import { CurrencyService } from '../../../shared/currency.service';
import { CurrencyInfo, CurrencySelectComponent } from './currency-select/currency-select.component';

@Component({
	selector: 'ex-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrl: './user-settings.component.scss',
	imports: [
		MatDividerModule,
		ThemeSelectComponent,
		LanguageSelectComponent,
		CurrencySelectComponent,
		ButtonComponent,
		TranslatePipe,
	],
})
export class UserSettingsComponent implements OnInit {
	private readonly userSettingService = inject(UserSettingsService);
	private readonly themeService = inject(DisplayThemeService);
	private readonly languageService = inject(LanguageService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);
	private readonly confirmExitService = inject(ConfirmExitService);

	dialogRef = input.required<DialogRef<void, void>>();
	readonly hasChangesChange = output<boolean>();

	userSettings = signal<UserSettingsResponse | null>(null);
	themes = signal<ThemeData | null>(null);
	language = signal<string | null>(null);
	currencyInfo = signal<CurrencyInfo | null>(null);

	initialCurrencyInfo = computed<CurrencyInfo | null>(() => {
		const s = this.userSettings();
		return s ? { baseCurrency: s.baseCurrency, showBaseCurrency: s.showBaseCurrency } : null;
	});

	initialThemes = computed<ThemeData | null>(() => {
		const s = this.userSettings();
		return s ? { primaryTheme: s.primaryTheme, secondaryTheme: s.secondaryTheme } : null;
	});

	initialLanguage = computed<{ lang: string } | null>(() => {
		const s = this.userSettings();
		return s ? { lang: s.language } : null;
	});

	themesValid = computed<boolean>(
		() => this.themes() !== null && this.themes()!.primaryTheme !== this.themes()!.secondaryTheme,
	);

	hasChanges = computed<boolean>(() => this.themesValid() || !!this.language() || !!this.currencyInfo());

	constructor() {
		this.userSettingService.list().then(response => {
			this.userSettings.set(response);
			this.themeService.setPreferredThemes(response.primaryTheme, response.secondaryTheme);
		});

		effect(() => {
			this.dialogRef().setLocked(this.hasChanges());
		});

		effect(() => {
			this.hasChangesChange.emit(this.hasChanges());
		});
	}

	ngOnInit(): void {
		this.dialogRef().setOnCloseAttemptWhileLocked(async () => await this.confirmExitService.showConfirmDialog());
	}

	async save(): Promise<void> {
		let request: UpdateUserSettingsRequest = {};
		if (this.themes()?.primaryTheme) request.primaryTheme = this.themes()!.primaryTheme;
		if (this.themes()?.secondaryTheme) request.secondaryTheme = this.themes()!.secondaryTheme;
		if (this.language()) request.language = this.language()!;
		if (this.currencyInfo()?.baseCurrency) request.baseCurrency = this.currencyInfo()!.baseCurrency;
		if (this.currencyInfo()?.showBaseCurrency) request.showBaseCurrency = this.currencyInfo()!.showBaseCurrency!;

		const response = await this.userSettingService.update(request);
		this.snackbarService.showSuccess(
			this.translocoService.translate(
				'profile.userSettings.theme.success',
				{},
				request.language ?? this.translocoService.getActiveLang(),
			),
		);

		this.themeService.setPreferredThemes(response.primaryTheme, response.secondaryTheme);
		this.languageService.setLanguage(response.language);
		this.currencyService.setBaseCurrency(response.baseCurrency);
		this.currencyService.useBaseCurrency(response.showBaseCurrency);
		this.resetCaches();
	}

	async cancel(): Promise<void> {
		this.userSettings.set(await this.userSettingService.list());
		this.resetCaches();
	}

	private resetCaches(): void {
		this.themes.set(null);
		this.language.set(null);
		this.currencyInfo.set(null);
	}
}
