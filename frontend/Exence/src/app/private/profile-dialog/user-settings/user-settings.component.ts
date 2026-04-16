import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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

@Component({
	selector: 'ex-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrl: './user-settings.component.scss',
	imports: [
		MatDividerModule,
		MatProgressSpinnerModule,
		ThemeSelectComponent,
		LanguageSelectComponent,
		ButtonComponent,
		TranslatePipe,
	],
})
export class UserSettingsComponent implements OnInit {
	private readonly userSettingService = inject(UserSettingsService);
	private readonly themeService = inject(DisplayThemeService);
	private readonly languageService = inject(LanguageService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);
	private readonly confirmExitService = inject(ConfirmExitService);

	dialogRef = input.required<DialogRef<void, void>>();
	readonly hasChangesChange = output<boolean>();

	saving = signal(false);
	userSettings = signal<UserSettingsResponse | null>(null);
	themes = signal<ThemeData | null>(null);
	language = signal<string | null>(null);

	initialThemes = computed<ThemeData | null>(() => {
		const s = this.userSettings();
		return s ? { primaryTheme: s.primaryTheme, secondaryTheme: s.secondaryTheme } : null;
	});

	initialLanguage = computed<string | undefined>(() => {
		return this.userSettings()?.language;
	});

	themesValid = computed<boolean>(
		() => this.themes() !== null && this.themes()!.primaryTheme !== this.themes()!.secondaryTheme,
	);

	hasChanges = computed<boolean>(() => this.themesValid() || !!this.language());

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

		this.saving.set(true);
		let response;
		try {
			response = await this.userSettingService.update(request);
		} finally {
			this.saving.set(false);
		}
		this.snackbarService.showSuccess(
			this.translocoService.translate(
				'profile.userSettings.success',
				{},
				request.language ?? this.translocoService.getActiveLang(),
			),
		);

		this.themeService.setPreferredThemes(response.primaryTheme, response.secondaryTheme);
		this.languageService.setLanguage(response.language);
		this.resetCaches();
	}

	async cancel(): Promise<void> {
		this.userSettings.set(await this.userSettingService.list());
		this.resetCaches();
	}

	private resetCaches(): void {
		this.themes.set(null);
		this.language.set(null);
	}
}
