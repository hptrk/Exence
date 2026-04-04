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
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { CurrencyService } from '../../../shared/currency.service';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogRef, DialogWithBaseComponent } from '../../../shared/dialog/dialog.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SelectAutoFocusDirective } from '../../../shared/select-auto-focus.directive';
import { localizeCurrency, toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../category.service';
import { ExchangeRateRequest, ExchangeRateService } from '../../../shared/exchange-rate.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isFuture } from 'date-fns';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { TransactionCreate } from '../../../data-model/modules/transaction/TransactionCreate';

export interface CreateTransactionDialogData {
	type?: TransactionType;
	isRecurring?: boolean;
}

@Component({
	selector: 'ex-create-transaction-dialog',
	templateUrl: './create-transaction-dialog.component.html',
	styleUrl: './create-transaction-dialog.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatCheckboxModule,
		MatIconModule,
		MatButtonToggleModule,
		MatTooltipModule,
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
})
export class CreateTransactionDialogComponent extends DialogWithBaseComponent<
	CreateTransactionDialogData | undefined,
	TransactionCreate | null
> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);
	private readonly exchangeRateService = inject(ExchangeRateService);

	data = this.dialogRef.value;

	transactionTypes = TransactionType;
	currencies = SupportedCurrency;

	private categories = signal<CategoryGet[]>([]);

	form = this.fb.group({
		title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		note: this.fb.control<string | undefined>(undefined, [Validators.maxLength(500)]),
		date: this.fb.control<Date>(new Date(), [Validators.required]),
		amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
		type: this.fb.control<TransactionType | null>(this.data?.type ?? TransactionType.EXPENSE, [
			Validators.required,
		]),
		currency: this.fb.control<SupportedCurrency>(this.currencyService.baseCurrency(), [Validators.required]),
		exchangeRate: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
		recurring: this.fb.control<boolean>(false),
		category: this.fb.group({
			category: this.fb.control<CategoryGet | null>(null, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});
	formValue = toRawValueSignal(this.form);

	private selectedType = toRawValueSignal(this.form.controls.type);
	private searchText = toRawValueSignal(this.form.controls.category.controls.searchText);
	private dateValue = toRawValueSignal(this.form.controls.date);
	private currencyValue = toRawValueSignal(this.form.controls.currency);

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
		if (this.data?.isRecurring) {
			this.form.controls.recurring.setValue(this.data.isRecurring);
		}

		effect(() => {
			const currency = this.currencyValue();
			const date = this.dateValue();
			const baseCurrency = this.currencyService.baseCurrency();
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

		effect(() => {
			this.selectedType(); // dependency
			this.form.controls.category.controls.category.reset();
			this.form.controls.category.controls.category.markAsPristine();
		});
	}

	close(): void {
		this.dialogRef.close(null);
	}

	create(): void {
		const formValue = this.form.getRawValue();
		this.dialogRef.submit({
			title: formValue.title,
			note: formValue.note ?? '',
			date: formValue.date.toISOString(),
			amount: formValue.amount!,
			type: formValue.type!,
			recurring: formValue.recurring,
			categoryId: formValue.category.category!.id!,
			currency: formValue.currency,
			exchangeRate: formValue.exchangeRate!,
		});
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	codeForTransactionType(type: TransactionType): TranslationCode {
		return `transactionType.${type}`;
	}
}
