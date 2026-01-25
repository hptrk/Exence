import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { startWith } from 'rxjs';
import { Category } from '../../../data-model/modules/category/Category';
import { Transaction } from '../../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogWithBaseComponent } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../category.service';
import { TransactionStore } from '../transaction.store';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';

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
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
	],
})
export class CreateTransactionDialogComponent extends DialogWithBaseComponent<CreateTransactionDialogData | undefined, void> implements OnInit {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);
	private readonly store = inject(TransactionStore);

	data = this.dialogRef.value;

	transactionTypes: TransactionType[] = Object.values(TransactionType);	

	form = this.fb.group({
		title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		note: this.fb.control<string | undefined>(undefined, [Validators.maxLength(500)]),
		date: this.fb.control<Date>(new Date(), [Validators.required]),
		amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
		type: this.fb.control<TransactionType>(TransactionType.EXPENSE, [Validators.required]),
		recurring: this.fb.control<boolean>(false),
		category: this.fb.group({
			category: this.fb.control<Category | null>(null, [Validators.required]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});

	private categories = signal<Category[]>([]);
	private searchText = toSignal(this.form.controls.category.controls.searchText.valueChanges.pipe(startWith('')), { initialValue: '' });
	
	filteredCategories = computed(() => {
		const categories = this.categories();
		const search = this.searchText();
		if (!search) return categories;
		return categories.filter(category => 
			category.name.toLowerCase().includes(search.toLowerCase())
		);
	});

	async ngOnInit(): Promise<void> {
		this.categories.set(await this.categoryService.list());
		if (this.data?.type) {
			this.form.controls.type.setValue(this.data.type);
		}
		if (this.data?.isRecurring) {
			this.form.controls.recurring.setValue(this.data.isRecurring);
		}
		this.addSubscription(this.form.controls.amount.valueChanges.subscribe(value => {
			if (value !== null) {
				this.form.controls.amount.setValue(parseFloat(value.toString()!), { emitEvent: false });
			}
		}));
	}

	close(): void {
		this.dialogRef.close();
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
		this.store.createTransaction(request);
		this.dialogRef.submit();
	}
}