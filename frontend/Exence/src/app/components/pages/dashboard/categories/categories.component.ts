import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { Transaction } from '../../../../models/Transaction';
import { Category } from '../../../../models/Category';

@Component({
  selector: 'app-categories',
  imports: [MatProgressBarModule, MatCardModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];
  categoryPercentages: { name: string; percentage: number }[] = [];

  ngOnInit() {
    this.calculateCategoryPercentages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions'] || changes['categories']) {
      this.calculateCategoryPercentages();
    }
  }

  private calculateCategoryPercentages() {
    const categoryTotals: { [key: string]: number } = {};
    let totalSpent = 0;

    this.transactions.forEach((transaction) => {
      if (transaction.amount < 0) {
        const category =
          this.categories.find(
            (category) => category.id === transaction.categoryId
          )?.name || 'Unknown';
        categoryTotals[category] =
          (categoryTotals[category] || 0) + Math.abs(transaction.amount);
        totalSpent += Math.abs(transaction.amount);
      }
    });

    this.categoryPercentages = Object.keys(categoryTotals)
      .map((category) => ({
        name: category,
        percentage: (categoryTotals[category] / totalSpent) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4); // Only show the top 4 categories
  }
}
