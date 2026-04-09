import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { format } from 'date-fns';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { DebtCreate } from '../../../data-model/modules/debt/DebtCreate';
import { DebtType } from '../../../data-model/modules/debt/DebtType';
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
import { SelectAutoFocusDirective } from '../../../shared/select-auto-focus.directive';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { localizeCurrency, toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../../transactions-and-categories/category.service';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
	selector: 'ex-create-debt-dialog',
	templateUrl: './create-debt-dialog.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatIconModule,
		AmountStepperComponent,
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
		EnumValuePipe,
		TranslatePipe,
		SelectAutoFocusDirective,
		MatDialogClose,
	],
})
export class CreateDebtDialogComponent extends DialogComponent<DebtType | undefined, DebtCreate | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly currencyService = inject(CurrencyService);
	private readonly categoryService = inject(CategoryService);
	private readonly translocoService = inject(TranslocoService);

	currencies = SupportedCurrency;
	debtTypes = DebtType;
	data = this.dialogRef.value;

	private readonly categoriesSignal = signal<CategoryGet[]>([]);

	form = this.fb.group({
		title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		counterpartyName: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		originalAmount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
		currency: this.fb.control<SupportedCurrency>(this.currencyService.baseCurrency(), [Validators.required]),
		deadline: this.fb.control<Date | null>(null),
		type: this.fb.control<DebtType>(this.data ?? DebtType.BORROWED, [Validators.required]),
		category: this.fb.group({
			category: this.fb.control<CategoryGet | null>(null, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});

	private readonly searchText = toRawValueSignal(this.form.controls.category.controls.searchText);

	filteredCategories = computed(() => {
		const search = this.searchText();
		const all = this.categoriesSignal();
		if (!search) return all;
		return all.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
	});

	constructor() {
		super(inject(DialogRef));
		this.categoryService.list().then(cats => this.categoriesSignal.set(cats));
	}

	codeForType(type: DebtType): TranslationCode {
		return `debts.type.${type}`;
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	create(): void {
		if (this.form.invalid) return;
		const v = this.form.getRawValue();
		const request: DebtCreate = {
			title: v.title,
			counterpartyName: v.counterpartyName,
			originalAmount: v.originalAmount!,
			currency: v.currency,
			type: v.type,
			categoryId: v.category.category!.id,
		};
		if (v.deadline) request.deadline = format(v.deadline, 'yyyy-MM-dd');
		this.dialogRef.submit(request);
	}
}
