import { Component, inject, OnInit, signal } from '@angular/core';
import { ChartWidget, StatCardWidget } from '../../data-model/modules/statistics/Widget';
import { ChartWidgetListComponent } from './chart-widget-list/chart-widget-list.component';
import { StatisticService } from './statistic.service';
import { StatCardListComponent } from './stat-card-list/stat-card-list.component';

@Component({
	selector: 'ex-statistics',
	templateUrl: './statistics.component.html',
	styleUrl: './statistics.component.scss',
	imports: [StatCardListComponent, ChartWidgetListComponent],
	providers: [StatisticService],
})
export class StatisticsComponent implements OnInit {
	private readonly statisticService = inject(StatisticService);

	statCards = signal<StatCardWidget[]>([]);
	charts = signal<ChartWidget[]>([]);

	ngOnInit(): void {
		this.statisticService.getLayout().then(({ statCards, charts }) => {
			this.statCards.set(statCards);
			this.charts.set(charts);
		});
	}
}
