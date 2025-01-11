import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Transaction } from '../../models/Transaction';
import { ChartOptions, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() transactions: Transaction[] = [];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 3000, // Disable animation
    },
    elements: {
      line: {
        tension: 0.5, // Smoothen the line
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  constructor() {}

  ngOnInit() {
    this.lineChartData.labels = this.transactions.map(
      (transaction) => transaction.title
    );
    this.lineChartData.datasets[0].data = this.transactions.map(
      (transaction) => transaction.amount
    );
  }
}
