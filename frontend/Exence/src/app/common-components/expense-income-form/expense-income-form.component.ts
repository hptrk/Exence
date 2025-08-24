import { Transaction } from './../../data-model/modules/transaction/Transaction';
import { CategoryService } from './../../services/category.service';
import { TransactionService } from './../../services/transaction.service';
import { Component, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { NewCategoryFormComponent } from './new-category-form/new-category-form.component';
import { Category } from '../../data-model/modules/category/Category';

const moment = _rollupMoment || _moment;
export const DATE_FORMATS = {
	parse: {
		dateInput: 'LL',
	},
	display: {
		dateInput: 'LL',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};

@Component({
	selector: 'ex-expense-income-form',
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		ReactiveFormsModule,
		MatChipsModule,
		MatIconModule,
		NewCategoryFormComponent,
	],
	providers: [provideNativeDateAdapter(), provideMomentDateAdapter(DATE_FORMATS)],
	templateUrl: './expense-income-form.component.html',
	styleUrl: './expense-income-form.component.scss',
})
export class ExpenseIncomeFormComponent implements OnInit {
	private fb = inject(FormBuilder);
	private transactionService = inject(TransactionService);
	private categoryService = inject(CategoryService);
	private dialogRef = inject(MatDialogRef);

	formType = input<'income' | 'expense'>('income');
	transaction = input<Transaction | null>();

	public categories = this.categoryService.getCategories();

	public isAddingCategory = signal(false);
	public isFormSubmitted = signal(false);
	public selectedCategory = signal<string | null>(null);

	public form!: UntypedFormGroup;
	public date = new FormControl(moment());

	ngOnInit() {
		const today = moment();
		this.form = this.fb.group({
			title: [this.transaction()?.title || '', Validators.required],
			categoryId: [this.transaction()?.categoryId || '', Validators.required],
			amount: [
				this.transaction() ? Math.abs(this.transaction()!.amount) : '',
				[Validators.required, Validators.min(1)],
			],
			date: [
				{
					value: this.transaction()?.date || today.format('YYYY-MM-DD'),
					disabled: false,
				},
				Validators.required,
			],
		});
	}

	selectCategory(categoryId: number): void {
		const category = this.categories().find(c => c.id === categoryId);
		this.selectedCategory.set(category?.name || null);
		this.form.get('categoryId')?.setValue(categoryId);
	}

	addCategory(): void {
		this.isAddingCategory.set(true);
	}

	onCategoryAdded(category: { name: string; emoji: string }): void {
		const newCategory: Category = {
			id: 0, // backend will generate the actual ID
			name: category.name,
			emoji: category.emoji,
		};

		this.categoryService.createCategory(newCategory).subscribe({
			next: createdCategory => {
				this.selectCategory(createdCategory.id);
				this.isAddingCategory.set(false);
			},
		});
	}

	onSubmit(): void {
		this.isFormSubmitted.set(true);

		if (this.form.valid) {
			const formValue = this.form.value;

			// TODO: most csak átírtam h működjön, ne any legyen
			const newTransaction: any = {
				id: this.transaction()?.id,
				title: formValue.title,
				date: formValue.date ?? undefined,
				amount: Number(formValue.amount),
				type: this.formType(),
				recurring: false,
				categoryId: Number(formValue.categoryId),
			};

			if (this.transaction()) {
				// Update existing transaction
				this.transactionService.updateTransaction(this.transaction()!.id, newTransaction).subscribe({
					next: () => {
						this.isFormSubmitted.set(false);
						this.dialogRef.close();
					},
					error: error => console.error('Failed to update transaction:', error),
				});
			} else {
				// Create new transaction
				this.transactionService.createTransaction(newTransaction).subscribe({
					next: () => {
						this.isFormSubmitted.set(false);
						this.dialogRef.close();
					},
					error: error => console.error('Failed to create transaction:', error),
				});
			}
		}
	}
}
