import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { format, parseISO } from 'date-fns';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { GoalPatch } from '../../../data-model/modules/goal/GoalPatch';
import { GoalStatus } from '../../../data-model/modules/goal/GoalStatus';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
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
import { GoalModel } from '../goal-list/goal-list.component';
import { TranslationCode } from '../../../shared/i18n/translation-types';

export interface EditGoalDialogData {
	goal: GoalModel;
}

@Component({
	selector: 'ex-edit-goal-dialog',
	templateUrl: './edit-goal-dialog.component.html',
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
export class EditGoalDialogComponent extends DialogComponent<EditGoalDialogData, GoalPatch | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);
	private readonly translocoService = inject(TranslocoService);

	data = this.dialogRef.value;

	currencies = SupportedCurrency;
	goalStatuses = GoalStatus;

	private readonly categoriesSignal = signal<CategoryGet[]>([]);

	form = this.fb.group(
		{
			title: this.fb.control<string>(this.data.goal.title, [Validators.required, Validators.maxLength(255)]),
			targetAmount: this.fb.control<number | null>(this.data.goal.targetAmount, [
				Validators.required,
				Validators.min(1),
			]),
			currentAmount: this.fb.control<number | null>(this.data.goal.currentAmount, [Validators.min(1)]),
			deadline: this.fb.control<Date | null>(parseISO(this.data.goal.deadline), [Validators.required]),
			category: this.fb.group({
				category: this.fb.control<CategoryGet | null>(this.data.goal.category ?? null, [Validators.required]),
				searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
			}),
			description: this.fb.control<string>(this.data.goal.description, [Validators.maxLength(500)]),
			status: this.fb.control<GoalStatus>(this.data.goal.status, [Validators.required]),
		},
		{ validators: [ExtraValidators.fieldNotLessThan('targetAmount', 'currentAmount')] },
	);

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
		this.form.markAsPristine();
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	codeForStatus(status: GoalStatus): TranslationCode {
		return `goals.status.${status}`;
	}

	close(): void {
		this.dialogRef.close(null);
	}

	save(): void {
		if (this.form.invalid) return;
		const formValue = this.form.getRawValue();
		const request: GoalPatch = {
			title: formValue.title,
			targetAmount: formValue.targetAmount!,
			deadline: format(formValue.deadline!, 'yyyy-MM-dd'),
			categoryId: formValue.category.category!.id,
			description: formValue.description || '',
			status: formValue.status,
		};
		if (formValue.currentAmount) request.currentAmount = formValue.currentAmount;
		this.dialogRef.submit(request);
	}
}
