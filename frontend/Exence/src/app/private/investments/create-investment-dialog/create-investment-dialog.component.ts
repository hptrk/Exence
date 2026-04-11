import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { format } from 'date-fns';
import { InvestmentCreate } from '../../../data-model/modules/investment/InvestmentCreate';
import { InvestmentType } from '../../../data-model/modules/investment/InvestmentType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { CurrencyService } from '../../../shared/currency.service';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { ValidatorComponent } from '../../../shared/validator/validator.component';

export interface CreateInvestmentDialogData {
	title: string;
	assetName: string | null;
	locked: boolean;
	lockedType?: InvestmentType | null;
	existingAssets?: { name: string; type: InvestmentType }[];
}

@Component({
	selector: 'ex-create-investment-dialog',
	templateUrl: './create-investment-dialog.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		AmountStepperComponent,
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
		EnumValuePipe,
		TranslatePipe,
		MatDialogClose,
	],
})
export class CreateInvestmentDialogComponent extends DialogComponent<
	CreateInvestmentDialogData,
	InvestmentCreate | null
> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly currencyService = inject(CurrencyService);

	investmentTypes = InvestmentType;
	currencies = SupportedCurrency;
	data = this.dialogRef.value;

	form = this.fb.group({
		asset: this.fb.control<string>(this.data.assetName ?? '', [Validators.required, Validators.maxLength(100)]),
		purchaseDate: this.fb.control<Date | null>(null, [Validators.required]),
		type: this.fb.control<InvestmentType | null>(null, [Validators.required]),
		amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
		currency: this.fb.control<SupportedCurrency>(this.currencyService.baseCurrency(), [Validators.required]),
		note: this.fb.control<string>('', [Validators.maxLength(500)]),
	});

	filteredAssets = signal<{ name: string; type: InvestmentType }[]>([]);

	constructor() {
		super(inject(DialogRef));
		const destroyRef = inject(DestroyRef);

		if (this.data.locked) {
			this.form.controls.asset.disable();
		}
		if (this.data.lockedType) {
			this.form.controls.type.setValue(this.data.lockedType);
			this.form.controls.type.disable();
		}

		const assets = this.data.existingAssets ?? [];
		this.filteredAssets.set(assets);

		this.form.controls.asset.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(value => {
			const filter = value.toLowerCase();
			this.filteredAssets.set(filter ? assets.filter(a => a.name.toLowerCase().includes(filter)) : assets);

			const exactMatch = assets.find(a => a.name === value);
			if (!exactMatch && !this.data.lockedType && this.form.controls.type.disabled) {
				this.form.controls.type.enable();
				this.form.controls.type.setValue(null);
			}
		});
	}

	onAssetSelected(event: MatAutocompleteSelectedEvent): void {
		const selected = (this.data.existingAssets ?? []).find(a => a.name === event.option.value);
		if (selected) {
			this.form.controls.type.setValue(selected.type);
			this.form.controls.type.disable();
		}
	}

	codeForType(type: InvestmentType): TranslationCode {
		return `investments.type_label.${type}`;
	}

	create(): void {
		if (this.form.invalid) return;
		const v = this.form.getRawValue();
		const request: InvestmentCreate = {
			asset: v.asset,
			purchaseDate: format(v.purchaseDate!, 'yyyy-MM-dd'),
			type: v.type!,
			amount: v.amount!,
			currency: v.currency,
		};
		if (v.note) request.note = v.note;
		this.dialogRef.submit(request);
	}
}
