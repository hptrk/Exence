import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DisplayTheme, DisplayThemeService } from '../../../../shared/display-theme.service';
import { TranslationCode } from '../../../../shared/i18n/translation-types';
import { EnumValuePipe } from '../../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { toRawValueSignal } from '../../../../shared/util/utils';
import { ValidatorComponent } from '../../../../shared/validator/validator.component';
import { ExtraValidators } from '../../../../shared/validators';
import { AnimatedSkeletonLoaderComponent } from '../../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';

export interface ThemeData {
	primaryTheme: DisplayTheme;
	secondaryTheme: DisplayTheme;
}

// colors: primary, secondary, card, app-background
const THEME_COLORS: Record<DisplayTheme, string[]> = {
	[DisplayTheme.LIGHT]: ['#c9c9f2', '#4f82ed', '#e4e4fa', '#f6f6fd'],
	[DisplayTheme.DARK]: ['#c9c9f2', '#143477', '#151828', '#121420'],
	[DisplayTheme.BLUE_DOLPHIN]: ['#ff6ec7', '#083b4c', '#0e5066', '#083b4c'],
};

@Component({
	selector: 'ex-theme-select',
	templateUrl: './theme-select.component.html',
	styleUrl: './theme-select.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		MatError,
		ValidatorComponent,
		AnimatedSkeletonLoaderComponent,
		TranslatePipe,
		EnumValuePipe,
	],
})
export class ThemeSelectComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly themeService = inject(DisplayThemeService);

	initialThemes = input.required<ThemeData | null | undefined>();

	readonly changed = output<ThemeData>();

	currentTheme = computed<DisplayTheme>(() => this.themeService.displayThemeSignal());

	readonly themes = DisplayTheme;
	readonly themeColors = THEME_COLORS;

	readonly form = this.fb.group(
		{
			primary: this.fb.control<DisplayTheme | null>(null, [Validators.required]),
			secondary: this.fb.control<DisplayTheme | null>(null, [Validators.required]),
		},
		{ validators: [ExtraValidators.theme] },
	);
	formValue = toRawValueSignal(this.form);

	constructor() {
		effect(() => {
			const themes = this.initialThemes();
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!themes?.primaryTheme || !themes?.secondaryTheme) return;
			this.form.patchValue(
				{
					primary: themes.primaryTheme,
					secondary: themes.secondaryTheme,
				},
				{ emitEvent: false },
			);
			this.form.markAsPristine();
		});

		effect(() => {
			const value = this.formValue();
			if (!this.form.dirty || !value.primary || !value.secondary) return;
			this.changed.emit({
				primaryTheme: value.primary,
				secondaryTheme: value.secondary,
			});
		});
	}

	codeForTheme(theme: DisplayTheme): TranslationCode {
		return `profile.userSettings.theme.themes.${theme}`;
	}
}
