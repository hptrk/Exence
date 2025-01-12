import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Transaction } from '../../models/Transaction';
import { ChartOptions, ChartConfiguration } from 'chart.js';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() transactions: Transaction[] = [];
  private themeSubscription!: Subscription;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private themeService: ThemeService) {}

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'rgba(222, 222, 247, 0.2)',
        borderColor: '#C9C9F2',
        pointBackgroundColor: '#C9C9F2',
        pointBorderColor: '#C9C9F2',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#C9C9F2',
        fill: 'origin',
        borderWidth: 4,
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 2000,
      },
      backgroundColor: {
        duration: 0,
      },
    },
    elements: {
      line: {
        tension: 0.3, // Smoothen the line
      },
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        display: false, // Hide X-axis labels
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  ngOnInit() {
    let balance = 0;
    const balanceData = this.transactions.map((transaction) => {
      balance += transaction.amount;
      return balance;
    });
    this.lineChartData.labels = this.transactions.map(
      (transaction) => transaction.title
    );
    this.lineChartData.datasets[0].data = balanceData;

    // Check the current theme and update chart colors accordingly
    this.updateChartColors(this.themeService.getIsDarkTheme);

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.themeChange$.subscribe(
      (isDarkMode) => {
        this.updateChartColors(isDarkMode);
      }
    );
  }
  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private updateChartColors(isDarkMode: boolean) {
    this.lineChartData.datasets[0].backgroundColor = isDarkMode
      ? 'rgba(222, 222, 247, 0.1)'
      : 'rgba(222, 222, 247, 0.4)';
    this.chart?.update();
  }
}
