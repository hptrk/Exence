import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { mapToExChartType, WidgetCatalogItem } from '../../data-model/modules/statistics/widget-config.model';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { ChartWidgetListComponent } from './chart-widget-list/chart-widget-list.component';
import { StatCardListComponent } from './stat-card-list/stat-card-list.component';
import { StatisticService } from './statistic.service';
import { WidgetCatalogDialogComponent } from './widget-catalog-dialog/widget-catalog-dialog.component';
import { WidgetStore } from './widget.store';

@Component({
	selector: 'ex-statistics',
	templateUrl: './statistics.component.html',
	styleUrl: './statistics.component.scss',
	imports: [
		CommonModule,
		MatMenuModule,
		MatIconModule,
		StatCardListComponent,
		ChartWidgetListComponent,
		ButtonComponent,
	],
	providers: [StatisticService, WidgetStore],
})
export class StatisticsComponent {
	private readonly dialog = inject(DialogService);
	readonly store = inject(WidgetStore);

	private readonly chartWidgetList = viewChild.required(ChartWidgetListComponent);
	private readonly statCardList = viewChild.required(StatCardListComponent);

	editing = signal<boolean>(false);

	async openCatalog(): Promise<void> {
		const result = await this.dialog.openNonModal<void, WidgetCatalogItem | null>(
			WidgetCatalogDialogComponent,
			undefined,
			{
				height: '75vh',
				width: '65vw',
			},
		);
		if (!result) return;

		const isStatCard = mapToExChartType(result.type) === 'statCard';
		const nextFreePosition = isStatCard
			? this.statCardList().getFirstPossiblePosition()
			: this.chartWidgetList().getFirstPossiblePosition();

		await this.store.addWidget(result, nextFreePosition);
	}

	cancelLayout(): void {
		this.store.cancelLayout();
		this.editing.set(false);
	}

	async saveLayout(): Promise<void> {
		await this.store.saveLayout();
		this.editing.set(false);
	}
}
