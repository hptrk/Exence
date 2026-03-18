import { Component, inject, OnInit, signal } from '@angular/core';
import { ChartWidget, StatCardWidget } from '../../data-model/modules/statistics/Widget';
import { ButtonComponent } from '../../shared/button/button.component';
import { ChartWidgetListComponent } from './chart-widget-list/chart-widget-list.component';
import { StatCardListComponent } from './stat-card-list/stat-card-list.component';
import { StatisticService } from './statistic.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'ex-statistics',
	templateUrl: './statistics.component.html',
	styleUrl: './statistics.component.scss',
	imports: [CommonModule, StatCardListComponent, ChartWidgetListComponent, ButtonComponent],
	providers: [StatisticService],
})
export class StatisticsComponent implements OnInit {
	private readonly statisticService = inject(StatisticService);

	statCards = signal<StatCardWidget[]>([]);
	charts = signal<ChartWidget[]>([]);

	editing = signal<boolean>(false);

	ngOnInit(): void {
		this.statisticService.getLayout().then(({ statCards, charts }) => {
			this.statCards.set(statCards);
			this.charts.set(charts);
		});
	}
}
