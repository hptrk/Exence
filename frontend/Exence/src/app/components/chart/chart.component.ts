import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, Plugin } from 'chart.js';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import {
  createCustomBackgroundPlugin,
  getLineChartData,
  lineChartOptions,
} from './chart-config';
import { Transaction } from '../../models/Transaction';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() transactions: Transaction[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public lineChartData = getLineChartData([], []);
  public lineChartOptions = lineChartOptions;
  private themeSubscription!: Subscription;
  private customBackgroundPlugin!: Plugin;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.initializeChart();
    this.subscribeToThemeChanges();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private initializeChart() {
    // Create custom background plugin
    this.customBackgroundPlugin = createCustomBackgroundPlugin(
      this.themeService.getIsDarkTheme
    );
    Chart.register(this.customBackgroundPlugin);

    // Calculate balance data
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
  }

  private subscribeToThemeChanges() {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.themeChange$.subscribe(
      (isDarkMode) => {
        this.updateChartColors(isDarkMode);
        this.registerCustomBackgroundPlugin(isDarkMode);
      }
    );
  }

  private updateChartColors(isDarkMode: boolean) {
    this.lineChartData.datasets[0].backgroundColor = isDarkMode
      ? 'rgba(222, 222, 247, 0.1)'
      : 'rgba(222, 222, 247, 0.4)';

    this.chart?.update();
  }

  private registerCustomBackgroundPlugin(isDarkMode: boolean) {
    Chart.unregister(this.customBackgroundPlugin);
    this.customBackgroundPlugin = createCustomBackgroundPlugin(isDarkMode);
    Chart.register(this.customBackgroundPlugin);
    this.chart?.update();
  }
}
