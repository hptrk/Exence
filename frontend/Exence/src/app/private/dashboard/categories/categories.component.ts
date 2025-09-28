import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { Transaction } from '../../../data-model/modules/transaction/Transaction';
import { Category } from '../../../data-model/modules/category/Category';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { BaseComponent } from '../../../shared/base-component/base.component';

@Component({
	selector: 'ex-categories',
	imports: [MatProgressBarModule, MatCardModule, CommonModule],
	templateUrl: './categories.component.html',
	styleUrl: './categories.component.scss',
})
export class CategoriesComponent extends BaseComponent implements OnInit, OnChanges {
	public display = inject(DisplaySizeService);

	expenses = input<Transaction[]>();
	categories = input<Category[]>();

	public categoryPercentages: { name: string; percentage: number }[] = [];

	ngOnInit() {
		this.calculateCategoryPercentages();
		
		// TEST
		this.categoryPercentages = [{name: 'Utilities', percentage: 40 }, {name: 'Groceries', percentage: 20 }, {name: 'Transport', percentage: 18 }, {name: 'Date', percentage: 22 }];

		this.addSubscription(this.display.isSm.subscribe((isSm) => {
			if (isSm) {
				this.categoryPercentages = this.categoryPercentages.slice(0, 4);
			} else {
				this.categoryPercentages = this.categoryPercentages.slice(0, 2);
			}
		}));
		
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['expenses'] || changes['categories']) {
			this.calculateCategoryPercentages();
		}
	}

	private calculateCategoryPercentages() {
		const categoryTotals: Record<string, number> = {};
		let totalSpent = 0;

		this.expenses()?.forEach(transaction => {
			const category =
				this.categories()?.find(category => category.id === transaction.categoryId)?.name || 'Unknown';
			categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(transaction.amount);
			totalSpent += Math.abs(transaction.amount);
		});

		this.categoryPercentages = Object.keys(categoryTotals)
			.map(category => ({
				name: category,
				percentage: (categoryTotals[category] / totalSpent) * 100,
			}))
			.sort((a, b) => b.percentage - a.percentage)
			.slice(0, 4); // Only show the top 4 categories
	}
}
