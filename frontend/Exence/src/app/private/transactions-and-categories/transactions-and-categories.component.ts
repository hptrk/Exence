import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../../data-model/modules/category/Category';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { FilterMenuComponent } from '../../shared/filter-menu/filter-menu.component';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { ValidatorComponent } from '../../shared/validator/validator.component';
import { CategoryStore } from './category.store';
import { CreateCategoryDialogComponent } from './create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent } from './create-transaction-dialog/create-transaction-dialog.component';
import { TransactionStore } from './transaction.store';

@Component({
	selector: 'ex-transactions-and-categories',
	templateUrl: './transactions-and-categories.component.html',
	styleUrl: './transactions-and-categories.component.scss',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatTabsModule,
		MatIconModule,
		MatTooltipModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		MatBadgeModule,
		MatDatepickerModule,
		MatLabel,
		MatError,
		DataTableComponent,
		ButtonComponent,
		FilterMenuComponent,
		ValidatorComponent,
		InputClearButtonComponent,
	],
})
export class TransactionsAndCategoriesComponent extends BaseComponent implements OnInit {
	private readonly dialog = inject(DialogService);
	private readonly categoryStore = inject(CategoryStore);
	private readonly fb = inject(NonNullableFormBuilder);
	readonly display = inject(DisplaySizeService);
	readonly transactionStore = inject(TransactionStore);

	categories = computed(() => this.categoryStore.categoryResource.value());
	transactions = computed(() => this.transactionStore.transactions());

	selectedIndex = 0;
	loading = false;

	transactionTypes = TransactionType;
	transactionTypesArr = Object.values(this.transactionTypes);

	transactionFilterForm = this.fb.group({
		searchText: this.fb.control<string>('', [Validators.maxLength(100)]),
		dateRange: this.fb.group({
			dateFrom: this.fb.control<Date | null>(null),
			dateTo: this.fb.control<Date | null>(null),
		}),
		amountRange: this.fb.group({
			min: this.fb.control<number | null>(null),
			max: this.fb.control<number | null>(null),
		}),
		category: this.fb.control<Category | null>(null),
		type: this.fb.control<TransactionType | null>(null),
		recurring: this.fb.control<boolean>(false),
	});

	get appliedFiltersCount(): number {
		return Object.entries(this.transactionFilterForm.controls).reduce((sum, [key, control]) => {
			if (key === 'dateRange' || key === 'amountRange') {
				const groupValue = control.value as Record<string, unknown>;
				const hasValue = Object.values(groupValue).some(v => !!v);
				return sum + (hasValue ? 1 : 0);
			}
			if (control.value) return sum + 1;
			return sum;
		}, 0);
	}

	get canCreateTransaction(): boolean {
		return !!this.categoryStore.categoryResource.value();
	}

	ngOnInit(): void {
		this.transactionStore.resetState();

		this.addSubscription(
			this.transactionFilterForm.valueChanges.subscribe(newFilters => {
				if (this.transactionFilterForm.invalid) return;
				this.transactionStore.updateFilters(newFilters as TransactionFilter);
			}),
		);
	}

	async openCreateTransactionDialog(): Promise<void> {
		await this.dialog.openNonModal(CreateTransactionDialogComponent, undefined);
	}

	async openCreateCategoryDialog(): Promise<void> {
		await this.dialog.openNonModal(CreateCategoryDialogComponent, undefined);
	}

	onScroll(type?: TransactionType, recurring?: boolean): void {
		this.transactionStore.loadNextPage(type, recurring);
	}
}
