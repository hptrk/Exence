import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { format, startOfToday } from 'date-fns';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { GoalCreate } from '../../../data-model/modules/goal/GoalCreate';
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
import { localizeCurrency, toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { ExtraValidators } from '../../../shared/validators';
import { CategoryService } from '../../transactions-and-categories/category.service';

@Component({
	selector: 'ex-create-goal-dialog',
	templateUrl: './create-goal-dialog.component.html',
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
	],
})
export class CreateGoalDialogComponent extends DialogComponent<undefined, GoalCreate | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly currencyService = inject(CurrencyService);
	private readonly categoryService = inject(CategoryService);
	private readonly translocoService = inject(TranslocoService);

	currencies = SupportedCurrency;
	today = startOfToday();

	private readonly categoriesSignal = signal<CategoryGet[]>([]);

	form = this.fb.group(
		{
			title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
			targetAmount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
			initialAmount: this.fb.control<number | null>(null, [Validators.min(0)]),
			currency: this.fb.control<SupportedCurrency>(this.currencyService.baseCurrency(), [Validators.required]),
			deadline: this.fb.control<Date | null>(null, [Validators.required]),
			category: this.fb.group({
				category: this.fb.control<CategoryGet | null>(null, [Validators.required]),
				searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
			}),
			description: this.fb.control<string>('', [Validators.maxLength(500)]),
		},
		{ validators: [ExtraValidators.initialAmountMax] },
	);

	private readonly searchText = toRawValueSignal(this.form.controls.category.controls.searchText);

	filteredCategories = computed(() => {
		const search = this.searchText();
		const all = this.categoriesSignal();
		if (!search) return all;
		return all.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
	});

	constructor() {
		super(inject(DialogRef) as DialogRef<undefined, GoalCreate | null>);
		this.categoryService.list().then(cats => this.categoriesSignal.set(cats));
	}

	deadlineDateFilter = (date: Date | null): boolean => {
		if (!date) return true;
		return date >= this.today;
	};

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	close(): void {
		this.dialogRef.close(null);
	}

	create(): void {
		if (this.form.invalid) return;
		const v = this.form.getRawValue();
		const request: GoalCreate = {
			title: v.title,
			targetAmount: v.targetAmount!,
			currency: v.currency,
			deadline: format(v.deadline!, 'yyyy-MM-dd'),
			categoryId: v.category.category!.id,
		};
		if (v.description) request.description = v.description;
		if (v.initialAmount !== null) request.initialAmount = v.initialAmount;
		this.dialogRef.submit(request);
	}
}
