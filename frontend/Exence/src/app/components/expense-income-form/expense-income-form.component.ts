import { TransactionService } from './../../services/transaction.service';
import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { NewCategoryFormComponent } from './new-category-form/new-category-form.component';
import { Transaction } from '../../models/Transaction';
import { Category } from '../../models/Category';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
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
  selector: 'app-expense-income-form',
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
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: './expense-income-form.component.html',
  styleUrl: './expense-income-form.component.scss',
})
export class ExpenseIncomeFormComponent {
  @Input() formType: 'income' | 'expense' = 'income';
  @Input() transaction!: Transaction;
  @Input() categories: Category[] = [];
  @Output() transactionAdded = new EventEmitter<void>();
  expenseIncomeForm!: FormGroup;
  formSubmitted: boolean = false;

  readonly date = new FormControl(moment());

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<ExpenseIncomeFormComponent>
  ) {}

  ngOnInit(): void {
    const today = moment();
    this.expenseIncomeForm = this.fb.group({
      title: [this.transaction?.title || '', Validators.required],
      category: [this.transaction?.categoryId || '', Validators.required],
      amount: [
        Math.abs(this.transaction?.amount) || '',
        [Validators.required, Validators.min(1)],
      ],
      date: [
        { value: this.transaction?.date || today, disabled: false },
        Validators.required,
      ],
    });
  }
  selectedCategory: string | null = null;
  addingCategory: boolean = false;

  selectCategory(categoryId: number): void {
    this.selectedCategory =
      this.categories.find((category) => category.id === categoryId)?.name ||
      null;
    this.expenseIncomeForm.get('category')?.setValue(categoryId);
  }

  addCategory(): void {
    this.addingCategory = true;
  }
  onCategoryAdded(category: { name: string; emoji: string }): void {
    const newCategory: Category = {
      id: this.categories.length + 1, // or generate a unique id
      name: category.name,
      emoji: category.emoji,
    };
    this.categories.push(newCategory);
    this.addingCategory = false;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.expenseIncomeForm.valid) {
      const formValue = this.expenseIncomeForm.value;
      const formData = {
        ...formValue,
        categoryId: formValue.category,
        recurring: false,
        type: this.formType,
      };
      this.transactionService.createTransaction(formData).subscribe(
        (response) => {
          console.log('Transaction added successfully:', response);
          this.formSubmitted = false;
          this.transactionAdded.emit(); // Emit an event to notify the parent component
          this.dialogRef.close(); // Close the dialog
        },
        (error) => {
          console.error('Failed to add transaction:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
