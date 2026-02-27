import { Component, inject, OnInit } from '@angular/core';
import { ChartWidgetListComponent } from './chart-widget-list/chart-widget-list.component';
import { StatisticCardListComponent } from './statistic-card-list/statistic-card-list.component';
import { StatisticService } from './statistic.service';
import { ChartWidget, StatCardWidget } from './Widget';

@Component({
	selector: 'ex-statistics',
	templateUrl: './statistics.component.html',
	styleUrl: './statistics.component.scss',
	imports: [StatisticCardListComponent, ChartWidgetListComponent],
	providers: [StatisticService],
})
export class StatisticsComponent implements OnInit {
	private readonly statisticService = inject(StatisticService);

	statCards: StatCardWidget[] = [];
	charts: ChartWidget[] = [];

	ngOnInit(): void {
		this.statisticService.getLayout().then(({ statCards, charts }) => {
			this.statCards = statCards;
			this.charts = charts;
		});
	}
}
