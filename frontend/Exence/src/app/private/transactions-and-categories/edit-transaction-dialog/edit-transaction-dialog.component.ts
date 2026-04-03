import { UpperCasePipe } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { startWith } from 'rxjs';
import { Category } from '../../../data-model/modules/category/Category';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { Transaction } from '../../../data-model/modules/transaction/Transaction';
import { TransactionModel } from '../../../data-model/modules/transaction/TransactionModel';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogWithBaseComponent } from '../../../shared/dialog/dialog.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SelectAutoFocusDirective } from '../../../shared/select-auto-focus.directive';
import { localizeCurrency } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../category.service';

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
export class EditTransactionDialogComponent
	extends DialogWithBaseComponent<EditTransactionDialogData, Transaction | null>
	implements OnInit
{
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);
	private readonly translocoService = inject(TranslocoService);

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
			Validators.required,
			Validators.min(0.01),
		]),
		recurring: this.fb.control<boolean>(this.data.transaction.recurring),
		category: this.fb.group({
			category: this.fb.control<Category | null>(this.data.transaction.category, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});

	private selectedType = toSignal(this.form.controls.type.valueChanges.pipe(startWith(this.data.transaction.type)), {
		initialValue: this.data.transaction.type,
	});
	private categories = signal<Category[]>([]);
	private searchText = toSignal(this.form.controls.category.controls.searchText.valueChanges.pipe(startWith('')), {
		initialValue: '',
	});

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

	compareCategories = (a: Category, b: Category): boolean => a.id === b.id;

	ngOnInit(): void {
		this.categoryService.list().then(categories => {
			this.categories.set(categories);
		});
		this.form.markAsPristine();
		this.addSubscription(
			this.form.controls.amount.valueChanges.subscribe(value => {
				if (value !== null) {
					this.form.controls.amount.setValue(parseFloat(value.toString()!), { emitEvent: false });
				}
			}),
		);
		this.addSubscription(
			this.form.controls.exchangeRate.valueChanges.subscribe(value => {
				if (value !== null) {
					this.form.controls.exchangeRate.setValue(parseFloat(value.toString()!), { emitEvent: false });
				}
			}),
		);
	}

	close(): void {
		this.dialogRef.close(null);
	}

	save(): void {
		const formValue = this.form.getRawValue();
		const result: Transaction = {
			id: this.data.transaction.id!,
			title: formValue.title,
			note: formValue.note ?? '',
			date: formValue.date.toISOString(),
			amount: formValue.amount!,
			type: formValue.type,
			recurring: formValue.recurring,
			categoryId: formValue.category.category!.id!,
			currency: formValue.currency,
			exchangeRate: formValue.exchangeRate!,
			baseCurrencyAmount: formValue.amount! * formValue.exchangeRate!,
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
}
