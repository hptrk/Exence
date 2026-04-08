import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { format, parseISO } from 'date-fns';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { DebtPatch } from '../../../data-model/modules/debt/DebtPatch';
import { DebtPayment } from '../../../data-model/modules/debt/DebtPayment';
import { DebtStatus } from '../../../data-model/modules/debt/DebtStatus';
import { DebtType } from '../../../data-model/modules/debt/DebtType';
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
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { localizeCurrency, toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../../transactions-and-categories/category.service';
import { DebtModel } from '../debt-list/debt-list.component';

export interface EditDebtDialogData {
	debt: DebtModel;
}

export type EditDebtDialogResult = { action: 'save'; patch: DebtPatch } | { action: 'payment'; payment: DebtPayment };

@Component({
	selector: 'ex-edit-debt-dialog',
	templateUrl: './edit-debt-dialog.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatIconModule,
		MatDividerModule,
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
export class EditDebtDialogComponent extends DialogComponent<EditDebtDialogData, EditDebtDialogResult | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);
	private readonly translocoService = inject(TranslocoService);

	data = this.dialogRef.value;

	debtTypes = DebtType;
	debtStatuses = DebtStatus;

	private readonly categoriesSignal = signal<CategoryGet[]>([]);

	form = this.fb.group({
		title: this.fb.control<string>(this.data.debt.title, [Validators.required, Validators.maxLength(255)]),
		counterpartyName: this.fb.control<string>(this.data.debt.counterpartyName, [
			Validators.required,
			Validators.maxLength(255),
		]),
		deadline: this.fb.control<Date | null>(this.data.debt.deadline ? parseISO(this.data.debt.deadline) : null),
		type: this.fb.control<DebtType>(this.data.debt.type, [Validators.required]),
		status: this.fb.control<DebtStatus>(this.data.debt.status, [Validators.required]),
		category: this.fb.group({
			category: this.fb.control<CategoryGet | null>(this.data.debt.category ?? null, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});

	paymentForm = this.fb.group({
		amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
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
		this.form.markAsPristine();
	}

	codeForStatus(status: DebtStatus): TranslationCode {
		return `debts.status.${status}`;
	}

	codeForType(type: DebtType): TranslationCode {
		return `debts.type.${type}`;
	}

	localizeCurrency(currency: string): string {
		return localizeCurrency(currency as never, this.translocoService.getActiveLang());
	}

	save(): void {
		if (this.form.invalid) return;
		const v = this.form.getRawValue();
		const patch: DebtPatch = {
			title: v.title,
			counterpartyName: v.counterpartyName,
			type: v.type,
			status: v.status,
			categoryId: v.category.category!.id,
		};
		if (v.deadline) patch.deadline = format(v.deadline, 'yyyy-MM-dd');
		this.dialogRef.submit({ action: 'save', patch });
	}

	makePayment(): void {
		if (this.paymentForm.invalid) return;
		const v = this.paymentForm.getRawValue();
		this.dialogRef.submit({ action: 'payment', payment: { amount: v.amount! } });
	}
}
