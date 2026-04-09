import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { format, parseISO } from 'date-fns';
import { InvestmentGet } from '../../../data-model/modules/investment/InvestmentGet';
import { InvestmentPatch } from '../../../data-model/modules/investment/InvestmentPatch';
import { InvestmentType } from '../../../data-model/modules/investment/InvestmentType';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { ValidatorComponent } from '../../../shared/validator/validator.component';

export interface EditInvestmentDialogData {
	investment: InvestmentGet;
	existingAssets: { name: string; type: InvestmentType }[];
}

@Component({
	selector: 'ex-edit-investment-dialog',
	templateUrl: './edit-investment-dialog.component.html',
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
export class EditInvestmentDialogComponent extends DialogComponent<EditInvestmentDialogData, InvestmentPatch | null> {
	private readonly fb = inject(NonNullableFormBuilder);

	investmentTypes = InvestmentType;
	data = this.dialogRef.value;

	form = this.fb.group({
		asset: this.fb.control<string>(this.data.investment.asset, [Validators.required, Validators.maxLength(100)]),
		purchaseDate: this.fb.control<Date | null>(parseISO(this.data.investment.purchaseDate), [Validators.required]),
		type: this.fb.control<InvestmentType>(this.data.investment.type, [Validators.required]),
		amount: this.fb.control<number | null>(this.data.investment.amount, [
			Validators.required,
			Validators.min(0.01),
		]),
		note: this.fb.control<string>(this.data.investment.note ?? '', [Validators.maxLength(500)]),
	});

	filteredAssets = signal<{ name: string; type: InvestmentType }[]>([]);

	constructor() {
		super(inject(DialogRef));
		const destroyRef = inject(DestroyRef);

		const assets = this.data.existingAssets;
		this.filteredAssets.set(assets);

		const initialMatch = assets.find(a => a.name === this.data.investment.asset);
		if (initialMatch) {
			this.form.controls.type.disable();
		}

		this.form.controls.asset.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(value => {
			const filter = value.toLowerCase();
			this.filteredAssets.set(filter ? assets.filter(a => a.name.toLowerCase().includes(filter)) : assets);

			const exactMatch = assets.find(a => a.name === value);
			if (!exactMatch && this.form.controls.type.disabled) {
				this.form.controls.type.enable();
			}
		});

		this.form.markAsPristine();
	}

	onAssetSelected(event: MatAutocompleteSelectedEvent): void {
		const selected = this.data.existingAssets.find(a => a.name === event.option.value);
		if (selected) {
			this.form.controls.type.setValue(selected.type);
			this.form.controls.type.disable();
		}
	}

	codeForType(type: InvestmentType): TranslationCode {
		return `investments.type_label.${type}`;
	}

	save(): void {
		if (this.form.invalid) return;
		const v = this.form.getRawValue();
		const patch: InvestmentPatch = {
			asset: v.asset,
			purchaseDate: format(v.purchaseDate!, 'yyyy-MM-dd'),
			type: v.type,
			amount: v.amount!,
			note: v.note || undefined,
		};
		this.dialogRef.submit(patch);
	}
}
