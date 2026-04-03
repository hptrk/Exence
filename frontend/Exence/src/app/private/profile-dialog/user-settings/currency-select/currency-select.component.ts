import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { SupportedCurrency } from '../../../../data-model/modules/user-settings/SupportedCurrency';
import { AnimatedSkeletonLoaderComponent } from '../../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { DisplaySizeService } from '../../../../shared/display-size.service';
import { InfoButtonComponent } from '../../../../shared/info-button/info-button.component';
import { EnumValuePipe } from '../../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { localizeCurrency, toRawValueSignal } from '../../../../shared/util/utils';
import { ValidatorComponent } from '../../../../shared/validator/validator.component';

export interface CurrencyInfo {
	baseCurrency: SupportedCurrency;
	showBaseCurrency?: boolean;
}

@Component({
	selector: 'ex-currency-select',
	templateUrl: './currency-select.component.html',
	styleUrl: './currency-select.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatCheckboxModule,
		ValidatorComponent,
		AnimatedSkeletonLoaderComponent,
		InfoButtonComponent,
		TranslatePipe,
		EnumValuePipe,
	],
})
export class CurrencySelectComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly translocoService = inject(TranslocoService);
	readonly display = inject(DisplaySizeService);

	currencyInfo = input.required<CurrencyInfo | null>();

	readonly changed = output<CurrencyInfo>();

	currency = computed<SupportedCurrency | undefined>(() => this.currencyInfo()?.baseCurrency);
	showBaseCurrency = computed<boolean | undefined>(() => this.currencyInfo()?.showBaseCurrency);

	readonly currencies = SupportedCurrency;

	readonly form = this.fb.group({
		baseCurrency: this.fb.control<SupportedCurrency | null>(null, [Validators.required]),
		showBaseCurrency: this.fb.control<boolean>(false),
	});
	formValue = toRawValueSignal(this.form);

	constructor() {
		effect(() => {
			if (!this.currency() || this.showBaseCurrency() === undefined) return;
			this.form.patchValue(
				{
					baseCurrency: this.currency()!,
					showBaseCurrency: this.showBaseCurrency()!,
				},
				{ emitEvent: false },
			);
			this.form.markAsPristine();
		});

		effect(() => {
			const value = this.formValue();
			if (!this.form.dirty) return;
			this.changed.emit({
				baseCurrency: value.baseCurrency!,
				showBaseCurrency: value.showBaseCurrency,
			});
		});
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}
}
