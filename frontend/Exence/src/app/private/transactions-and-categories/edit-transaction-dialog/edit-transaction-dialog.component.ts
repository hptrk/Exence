import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { format, isFuture } from 'date-fns';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { TransactionModel } from '../../../data-model/modules/transaction/TransactionModel';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SelectAutoFocusDirective } from '../../../shared/select-auto-focus.directive';
import { localizeCurrency, toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../category.service';
import { ExchangeRateRequest, ExchangeRateService } from '../../../shared/exchange-rate.service';
import { CurrencyService } from '../../../shared/currency.service';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { TransactionPatch } from '../../../data-model/modules/transaction/TransactionPatch';

export interface EditTransactionDialogData {
	transaction: TransactionModel;
}

@Component({
	selector: 'ex-edit-transaction-dialog',
	templateUrl: './edit-transaction-dialog.component.html',
	styleUrl: './edit-transaction-dialog.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatCheckboxModule,
		MatIconModule,
		MatButtonToggleModule,
		AmountStepperComponent,
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
		EnumValuePipe,
		SelectAutoFocusDirective,
		TranslatePipe,
		UpperCasePipe,
	],
	host: {
		'(window:beforeunload)': 'onBeforeUnload($event)',
	},
})
export class EditTransactionDialogComponent extends DialogComponent<
	EditTransactionDialogData,
	TransactionPatch | null
> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);
	private readonly translocoService = inject(TranslocoService);
	private readonly exchangeRateService = inject(ExchangeRateService);
	private readonly currencyService = inject(CurrencyService);

	data = this.dialogRef.value;

	transactionTypes = TransactionType;
	currencies = SupportedCurrency;

	form = this.fb.group({
		type: this.fb.control<TransactionType>(this.data.transaction.type, [Validators.required]),
		title: this.fb.control<string>(this.data.transaction.title, [Validators.required, Validators.maxLength(255)]),
		note: this.fb.control<string | undefined>(this.data.transaction.note, [Validators.maxLength(500)]),
		date: this.fb.control<Date>(new Date(this.data.transaction.date), [Validators.required]),
		amount: this.fb.control<number | null>(this.data.transaction.amount, [Validators.required, Validators.min(1)]),
		currency: this.fb.control<SupportedCurrency>(this.data.transaction.currency, [Validators.required]),
		exchangeRate: this.fb.control<number | null>(this.data.transaction.exchangeRate, [
			Validators.min(0.0000000001),
		]),
		category: this.fb.group({
			category: this.fb.control<CategoryGet | null>(this.data.transaction.category, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});
	formValue = toRawValueSignal(this.form);
	searchText = toRawValueSignal(this.form.controls.category.controls.searchText);
	private dateValue = toRawValueSignal(this.form.controls.date);
	private currencyValue = toRawValueSignal(this.form.controls.currency);
	private selectedType = toRawValueSignal(this.form.controls.type);

	private categories = signal<CategoryGet[]>([]);

	filteredCategories = computed(() => {
		const type = this.selectedType();
		const categories = this.categories().filter(c => {
			switch (type) {
				case TransactionType.INCOME:
					return c.type === CategoryType.INCOME || c.type === CategoryType.MIXED;
				case TransactionType.EXPENSE:
					return c.type === CategoryType.EXPENSE || c.type === CategoryType.MIXED;
				default:
					return true;
			}
		});
		const search = this.searchText();
		if (!search) return categories;
		return categories.filter(category => category.name.toLowerCase().includes(search.toLowerCase()));
	});

	categorySearchRef = viewChild<ElementRef<HTMLInputElement>>('searchCategoryInput');

	constructor() {
		super(inject(DialogRef));

		this.categoryService.list().then(categories => {
			this.categories.set(categories);
		});
		this.form.markAsPristine();

		let initialType = true;
		effect(() => {
			this.selectedType();
			if (initialType) {
				initialType = false;
				return;
			}
			this.form.controls.category.controls.category.setValue(null);
		});

		effect(() => {
			const currency = this.currencyValue();
			const date = this.dateValue();
			const baseCurrency = this.currencyService.baseCurrency();
			if (this.data.transaction.currency === currency) return;
			const request: ExchangeRateRequest = {
				from: currency,
				to: baseCurrency,
				date: isFuture(date) ? new Date() : date,
			};
			this.form.controls.exchangeRate.disable();
			this.exchangeRateService
				.getRate(request)
				.then(response => this.form.controls.exchangeRate.setValue(response))
				.finally(() => this.form.controls.exchangeRate.enable());
		});
	}

	close(): void {
		this.dialogRef.close(null);
	}

	save(): void {
		const formValue = this.form.getRawValue();
		const result: TransactionPatch = {
			title: formValue.title,
			note: formValue.note ?? '',
			date: format(formValue.date, 'yyyy-MM-dd'),
			amount: formValue.amount!,
			type: formValue.type,
			categoryId: formValue.category.category!.id,
			currency: formValue.currency,
			exchangeRate: formValue.exchangeRate!,
		};
		this.dialogRef.submit(result);
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	codeForTransactionType(type: TransactionType): TranslationCode {
		return `transactionType.${type}`;
	}

	onBeforeUnload(event: BeforeUnloadEvent): void {
		if (this.dialogRef.isLocked) event.preventDefault();
	}

	compareCategories(a: CategoryGet, b: CategoryGet): boolean {
		return a.id === b.id;
	}
}
