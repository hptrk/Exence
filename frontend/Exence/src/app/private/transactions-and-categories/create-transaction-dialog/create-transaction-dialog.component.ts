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
import { startWith } from 'rxjs';
import { Category } from '../../../data-model/modules/category/Category';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { Transaction } from '../../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
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
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../category.service';

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
export class CreateTransactionDialogComponent
	extends DialogWithBaseComponent<CreateTransactionDialogData | undefined, Transaction | null>
	implements OnInit
{
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);

	data = this.dialogRef.value;

	transactionTypes = TransactionType;

	form = this.fb.group({
		title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		note: this.fb.control<string | undefined>(undefined, [Validators.maxLength(500)]),
		date: this.fb.control<Date>(new Date(), [Validators.required]),
		amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
		type: this.fb.control<TransactionType | null>(null, [Validators.required]),
		recurring: this.fb.control<boolean>(false),
		category: this.fb.group({
			category: this.fb.control<Category | null>(null, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});

	private selectedType = toSignal(this.form.controls.type.valueChanges.pipe(startWith(null)), { initialValue: null });
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

	ngOnInit(): void {
		this.categoryService.list().then(categories => {
			this.categories.set(categories);
		});
		if (this.data?.type) {
			this.form.controls.type.setValue(this.data.type);
		}
		if (this.data?.isRecurring) {
			this.form.controls.recurring.setValue(this.data.isRecurring);
		}
		this.addSubscription(
			this.form.controls.amount.valueChanges.subscribe(value => {
				if (value !== null) {
					this.form.controls.amount.setValue(parseFloat(value.toString()!), { emitEvent: false });
				}
			}),
		);
	}

	close(): void {
		this.dialogRef.close(null);
	}

	create(): void {
		const formValue = this.form.getRawValue();
		const request: Transaction = {
			title: formValue.title,
			note: formValue.note,
			date: formValue.date.toISOString(),
			amount: formValue.amount!,
			type: formValue.type,
			recurring: formValue.recurring,
			categoryId: formValue.category!.category!.id!,
		} as Transaction;
		this.dialogRef.submit(request);
	}

	codeForTransactionType(type: TransactionType): TranslationCode {
		return `transactionType.${type}`;
	}
}
