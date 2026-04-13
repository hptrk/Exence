import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@jsverse/transloco';
import { format, isFuture, startOfDay } from 'date-fns';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { DayOfWeek } from '../../../data-model/modules/transaction/DayOfWeek';
import { EndCondition } from '../../../data-model/modules/transaction/EndCondition';
import { RecurrenceFrequency } from '../../../data-model/modules/transaction/RecurrenceFrequency';
import { RecurringTransactionCreate } from '../../../data-model/modules/transaction/RecurringTransactionCreate';
import { TransactionCreate } from '../../../data-model/modules/transaction/TransactionCreate';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { CurrencyService } from '../../../shared/currency.service';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogRef, DialogWithBaseComponent } from '../../../shared/dialog/dialog.service';
import { ExchangeRateRequest, ExchangeRateService } from '../../../shared/exchange-rate.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { NoteBoxComponent } from '../../../shared/note-box/note-box.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { OrdinalPipe } from '../../../shared/pipes/ordinal.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SelectAutoFocusDirective } from '../../../shared/select-auto-focus.directive';
import { getAmountStep, localizeCurrency, toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { ExtraValidators } from '../../../shared/validators';
import { CategoryService } from '../category.service';

const DAYS_OF_WEEK_INDEX: Record<DayOfWeek, number> = {
	[DayOfWeek.SUNDAY]: 0,
	[DayOfWeek.MONDAY]: 1,
	[DayOfWeek.TUESDAY]: 2,
	[DayOfWeek.WEDNESDAY]: 3,
	[DayOfWeek.THURSDAY]: 4,
	[DayOfWeek.FRIDAY]: 5,
	[DayOfWeek.SATURDAY]: 6,
};

export interface CreateTransactionDialogData {
	type?: TransactionType;
	isRecurring?: boolean;
}

export interface CreateTransactionDialogResult {
	result: TransactionCreate | RecurringTransactionCreate;
	isRecurring: boolean;
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
		NoteBoxComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
		SelectAutoFocusDirective,
		EnumValuePipe,
		TranslatePipe,
		UpperCasePipe,
		OrdinalPipe,
	],
})
export class CreateTransactionDialogComponent extends DialogWithBaseComponent<
	CreateTransactionDialogData | undefined,
	CreateTransactionDialogResult | null
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

	readonly daysOfWeek = Object.values(DayOfWeek);
	readonly daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
	readonly recurrenceFrequencies = RecurrenceFrequency;
	readonly endConditions = EndCondition;

	form = this.fb.group({
		title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		note: this.fb.control<string | undefined>(undefined, [Validators.maxLength(500)]),
		date: this.fb.control<Date>(new Date(), [Validators.required]),
		amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
		type: this.fb.control<TransactionType | null>(this.data?.type ?? TransactionType.EXPENSE, [
			Validators.required,
		]),
		currency: this.fb.control<SupportedCurrency>(this.currencyService.baseCurrency(), [Validators.required]),
		exchangeRate: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.0000000001)]),
		category: this.fb.group({
			category: this.fb.control<CategoryGet | null>(null, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
		recurring: this.fb.group({
			isRecurring: this.fb.control<boolean>(false),
			configs: this.fb.group(
				{
					interval: this.fb.control<number>(1, [Validators.required, Validators.min(1)]),
					frequency: this.fb.control<RecurrenceFrequency>(RecurrenceFrequency.WEEKLY, [Validators.required]),
					dayOfWeek: this.fb.control<DayOfWeek>(this.daysOfWeek[(new Date().getDay() + 6) % 7]),
					dayOfMonth: this.fb.control<number>(new Date().getDate()),
					endCondition: this.fb.control<EndCondition>(EndCondition.NEVER, [Validators.required]),
					startDate: this.fb.control<Date>(new Date(), [Validators.required]),
					endDate: this.fb.control<Date | null>(null),
					maxOccurrences: this.fb.control<number>(1, [Validators.min(1)]),
				},
				{
					validators: [
						ExtraValidators.dayOfWeekRequiredForWeekly,
						ExtraValidators.dayOfMonthRequiredForMonthly,
						ExtraValidators.endDateRequiredForEndCondition,
					],
				},
			),
		}),
	});
	formValue = toRawValueSignal(this.form);
	isRecurring = toRawValueSignal(this.form.controls.recurring.controls.isRecurring);
	frequencyValue = toRawValueSignal(this.form.controls.recurring.controls.configs.controls.frequency);
	dayOfWeekValue = toRawValueSignal(this.form.controls.recurring.controls.configs.controls.dayOfWeek);
	dayOfMonthValue = toRawValueSignal(this.form.controls.recurring.controls.configs.controls.dayOfMonth);

	endDateErrorMatcher: ErrorStateMatcher = {
		isErrorState: control =>
			(!!control?.parent?.hasError('endDateRequired') || !!control?.hasError('matDatepickerFilter')) &&
			!!control.touched,
	};

	private selectedType = toRawValueSignal(this.form.controls.type);
	private searchText = toRawValueSignal(this.form.controls.category.controls.searchText);
	private dateValue = toRawValueSignal(this.form.controls.date);
	private currencyValue = toRawValueSignal(this.form.controls.currency);

	amountStep = computed(() => getAmountStep(1, this.currencyValue()));

	recurringDateFilter = computed((): DateFilterFn<Date | null> => {
		const frequency = this.frequencyValue();
		const dayOfWeek = this.dayOfWeekValue();
		const dayOfMonth = this.dayOfMonthValue();

		return (date: Date | null) => {
			if (!date) return true;

			if (date < startOfDay(new Date())) return false;

			if (frequency === RecurrenceFrequency.WEEKLY) {
				return date.getDay() === DAYS_OF_WEEK_INDEX[dayOfWeek];
			}

			if (frequency === RecurrenceFrequency.MONTHLY) {
				const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
				const target = dayOfMonth >= lastDay ? lastDay : dayOfMonth;
				return date.getDate() === target;
			}

			return true;
		};
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

	exchangeRateDisabledReason = computed<TranslationCode>(() => {
		if (this.isRecurring()) return 'recurring.featureDisabledByRecurring';
		return 'transaction.create.disabledExchangeRate';
	});

	categorySearchRef = viewChild<ElementRef<HTMLInputElement>>('searchCategoryInput');

	constructor() {
		super(inject(DialogRef));

		this.categoryService.list().then(categories => {
			this.categories.set(categories);
		});
		if (this.data?.isRecurring) {
			this.form.controls.recurring.controls.isRecurring.setValue(this.data.isRecurring);
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

		effect(() => {
			if (this.isRecurring()) {
				this.form.controls.date.disable();
				this.form.controls.exchangeRate.disable();
			} else {
				this.form.controls.date.enable();
				this.form.controls.exchangeRate.enable();
			}
		});

		effect(() => {
			this.frequencyValue();
			this.dayOfWeekValue();
			this.dayOfMonthValue();
			const recurringConfigs = this.form.controls.recurring.controls.configs.controls;
			recurringConfigs.startDate.markAsTouched();
			recurringConfigs.endDate.markAsTouched();
		});
	}

	close(): void {
		this.dialogRef.close(null);
	}

	create(): void {
		const formValue = this.form.getRawValue();
		const recurringConfigs = formValue.recurring.configs;
		let request!: TransactionCreate | RecurringTransactionCreate;
		if (this.isRecurring()) {
			request = {
				title: formValue.title,
				note: formValue.note ?? '',
				amount: formValue.amount!,
				type: formValue.type!,
				categoryId: formValue.category.category!.id!,
				currency: formValue.currency,
				frequency: recurringConfigs.frequency,
				interval: recurringConfigs.interval,
				endCondition: recurringConfigs.endCondition,
				startDate: format(recurringConfigs.startDate, 'yyyy-MM-dd'),
			} satisfies RecurringTransactionCreate;
			if (recurringConfigs.frequency === RecurrenceFrequency.WEEKLY)
				request.dayOfWeek = recurringConfigs.dayOfWeek;
			if (recurringConfigs.frequency === RecurrenceFrequency.MONTHLY)
				request.dayOfMonth = recurringConfigs.dayOfMonth;
			if (recurringConfigs.endCondition === EndCondition.UNTIL_DATE)
				request.endDate = format(recurringConfigs.endDate!, 'yyyy-MM-dd');
			if (recurringConfigs.endCondition === EndCondition.AFTER_OCCURRENCES)
				request.maxOccurrences = recurringConfigs.maxOccurrences;
		} else {
			request = {
				title: formValue.title,
				note: formValue.note ?? '',
				date: format(formValue.date, 'yyyy-MM-dd'),
				amount: formValue.amount!,
				type: formValue.type!,
				categoryId: formValue.category.category!.id!,
				currency: formValue.currency,
				exchangeRate: formValue.exchangeRate!,
			} satisfies TransactionCreate;
		}
		this.dialogRef.submit({ result: request, isRecurring: this.isRecurring() });
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	codeForTransactionType(type: TransactionType): TranslationCode {
		return `transactionType.${type}`;
	}

	codeForFrequency(freq: RecurrenceFrequency): TranslationCode {
		return `recurring.frequency.${freq}`;
	}

	codeForDayOfWeek(wDay: DayOfWeek): TranslationCode {
		return `recurring.dayOfWeek.${wDay}.short`;
	}

	codeForEndCondition(cond: EndCondition): TranslationCode {
		return `recurring.ends.endCondition.${cond}`;
	}
}
