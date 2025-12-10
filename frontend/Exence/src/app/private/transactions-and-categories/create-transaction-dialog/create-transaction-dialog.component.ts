import { Component, inject, OnInit } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Category } from "../../../data-model/modules/category/Category";
import { Transaction } from "../../../data-model/modules/transaction/Transaction";
import { TransactionType } from "../../../data-model/modules/transaction/TransactionType";
import { ButtonComponent } from "../../../shared/button/button.component";
import { InputClearButtonComponent } from "../../../shared/input-clear-button/input-clear-button.component";
import { TransactionService } from "../transaction.service";
import { CategoryService } from "../../category.service";
import { BaseComponent } from "../../../shared/base-component/base.component";

export interface CreateTransactionDialogData {
	type?: TransactionType;
	isRecurring?: boolean;
}

@Component({
	selector: 'ex-create-transaction-dialog',
	templateUrl: './create-transaction-dialog.component.html',
	styleUrl: './create-transaction-dialog.component.scss',
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatSelectModule, MatDatepickerModule, MatCheckboxModule, InputClearButtonComponent, ButtonComponent],
})
export class CreateTransactionDialogComponent extends BaseComponent implements OnInit {
	private readonly dialogRef = inject(MatDialogRef<CreateTransactionDialogComponent>);
	private readonly transactionService = inject(TransactionService);
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);

	data = inject(MAT_DIALOG_DATA);

	transactionTypes: TransactionType[] = Object.values(TransactionType);

	categories: Category[] = [];

	form = this.fb.group({
		title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		note: this.fb.control<string | undefined>(undefined, [Validators.maxLength(500)]),
		date: this.fb.control<Date>(new Date(), [Validators.required]),
		amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
		type: this.fb.control<TransactionType>(TransactionType.EXPENSE, [Validators.required]),
		recurring: this.fb.control<boolean>(false),
		category: this.fb.control<Category | null>(null, [Validators.required]),
	});

	async ngOnInit(): Promise<void> {
		this.categories = await this.categoryService.list();
		if (this.data.type) {
			this.form.controls.type.setValue(this.data.type)
		}
		if (this.data.isRecurring) {
			this.form.controls.recurring.setValue(this.data.isRecurring);
		}
		this.addSubscription(this.form.controls.amount.valueChanges.subscribe(value => {
			if (value !== null) {
				this.form.controls.amount.setValue(parseFloat(value.toString()!));
			}
		}));
	}

	close(): void {
		this.dialogRef.close();
	}

	async create(): Promise<void> {
		const formValue = this.form.getRawValue();
		const request: Transaction = {
			title: formValue.title,
			note: formValue?.note ?? undefined,
			date: formValue.date.toISOString(),
			amount: formValue.amount!,
			type: formValue.type,
			recurring: formValue.recurring,
			categoryId: formValue.category!.id!,
		};
		try {
			const newTransaction = await this.transactionService.create(request);
			this.dialogRef.close(newTransaction);
		} catch (err) {
			this.dialogRef.close();
			throw err;
		}
	}
}