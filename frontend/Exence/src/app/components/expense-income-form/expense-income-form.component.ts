import { Component, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  expenseIncomeForm!: FormGroup;
  formSubmitted: boolean = false;

  readonly date = new FormControl(moment());

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const today = moment();
    this.expenseIncomeForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: [{ value: today, disabled: false }, Validators.required],
    });
  }

  // Categories
  categories: { name: string; emoji: string }[] = [
    { name: 'Food', emoji: '🍔' },
    { name: 'Transport', emoji: '🚗' },
    { name: 'Utilities', emoji: '💡' },
    { name: 'Entertainment', emoji: '🎬' },
  ];
  selectedCategory: string | null = null;
  addingCategory: boolean = false;

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.expenseIncomeForm.get('category')?.setValue(category);
  }

  addCategory(): void {
    this.addingCategory = true;
  }
  onCategoryAdded(category: { name: string; emoji: string }): void {
    this.categories.push(category);
    this.addingCategory = false;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.expenseIncomeForm.valid) {
      const formValue = this.expenseIncomeForm.value;
      // if the form is an expense, make the amount negative
      const amount =
        this.formType === 'expense' ? -formValue.amount : formValue.amount;

      const formData = {
        ...formValue,
        amount,
      };
      this.formSubmitted = false;
      // API call to save the data
      console.log('Form data:', formData);
    } else {
      console.log('Form is invalid');
    }
  }
}
