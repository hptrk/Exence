import { Transaction } from './../../data-model/modules/transaction/Transaction';
// import { CategoryService } from '../../private/category.service';
// import { TransactionService } from '../../private/transactions/transaction.service';
import { Component, inject, input, signal, OnInit, computed } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewCategoryFormComponent } from './new-category-form/new-category-form.component';
import { Category } from '../../data-model/modules/category/Category';
import { emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { format } from 'date-fns';

@Component({
	selector: 'ex-expense-income-form',
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		ReactiveFormsModule,
		MatChipsModule,
		MatIconModule,
		NewCategoryFormComponent,
	],
	providers: [provideNativeDateAdapter()],
	templateUrl: './expense-income-form.component.html',
	styleUrl: './expense-income-form.component.scss',
})
export class ExpenseIncomeFormComponent implements OnInit {
	private fb = inject(FormBuilder);
	// private transactionService = inject(TransactionService);
	// private categoryService = inject(CategoryService);
	private dialogRef = inject(MatDialogRef);

	formType = input<'income' | 'expense'>('income');
	transaction = input<Transaction | null>();

	// public categories = this.categoryService.getCategories();
	public categories = computed(() => [{id: 1, name: 'dummycategory', emoji: '💀'}]);

	public isAddingCategory = signal(false);
	public isFormSubmitted = signal(false);
	public selectedCategory = signal<string | null>(null);

	public form!: UntypedFormGroup;
	public date = new FormControl(new Date());

	ngOnInit() {
		const today = new Date();
		this.form = this.fb.group({
			title: [this.transaction()?.title || '', Validators.required],
			categoryId: ['', Validators.required],
			amount: [
				this.transaction() ? Math.abs(this.transaction()!.amount) : '',
				[Validators.required, Validators.min(1)],
			],
			date: [
				{
					value: this.transaction()?.date || format(today, 'YYYY-MM-DD'),
					disabled: false,
				},
				Validators.required,
			],
		});
	}

	selectCategory(categoryId: number): void {
		// const category = this.categories().find(c => c.id === categoryId);
		// this.selectedCategory.set(category?.name || null);
		// this.form.get('categoryId')?.setValue(categoryId);
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

		// this.categoryService.createCategory(newCategory).subscribe({
		// 	next: createdCategory => {
		// 		this.selectCategory(createdCategory.id);
		// 		this.isAddingCategory.set(false);
		// 	},
		// });
	}

	onSubmit(): void {
		// this.isFormSubmitted.set(true);

		// if (this.form.valid) {
		// 	const formValue = this.form.value;

		// 	// TODO: most csak átírtam h működjön, ne any legyen
		// 	const newTransaction: any = {
		// 		id: this.transaction()?.id,
		// 		title: formValue.title,
		// 		date: formValue.date ?? undefined,
		// 		amount: Number(formValue.amount),
		// 		type: this.formType(),
		// 		recurring: false,
		// 		categoryId: Number(formValue.categoryId),
		// 	};

		// 	if (this.transaction()) {
		// 		// Update existing transaction
		// 		this.transactionService.updateTransaction(this.transaction()!.id, newTransaction).subscribe({
		// 			next: () => {
		// 				this.isFormSubmitted.set(false);
		// 				this.dialogRef.close();
		// 			},
		// 			error: error => console.error('Failed to update transaction:', error),
		// 		});
		// 	} else {
		// 		// Create new transaction
		// 		this.transactionService.createTransaction(newTransaction).subscribe({
		// 			next: () => {
		// 				this.isFormSubmitted.set(false);
		// 				this.dialogRef.close();
		// 			},
		// 			error: error => console.error('Failed to create transaction:', error),
		// 		});
		// 	}
		// }
	}
}
