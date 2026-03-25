import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { mapToExChartType } from '../../data-model/modules/statistics/widget-config.model';
import { HasChangesComponent } from '../../shared/auth/guard/has-changes.guard';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { ChartWidgetListComponent } from './chart-widget-list/chart-widget-list.component';
import { StatCardListComponent } from './stat-card-list/stat-card-list.component';
import { StatisticService } from './statistic.service';
import {
	WidgetCatalogDialogComponent,
	WidgetCatalogDialogData,
	WidgetCatalogDialogResult,
} from './widget-catalog-dialog/widget-catalog-dialog.component';
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
	host: {
		'(window:beforeunload)': 'onBeforeUnload($event)',
	},
})
export class StatisticsComponent implements HasChangesComponent {
	private readonly dialog = inject(DialogService);
	private readonly snackbarService = inject(SnackbarService);
	readonly store = inject(WidgetStore);

	private readonly chartWidgetList = viewChild.required(ChartWidgetListComponent);
	private readonly statCardList = viewChild.required(StatCardListComponent);

	editing = signal<boolean>(false);

	constructor() {
		effect(() => {
			if (this.editing()) {
				this.snackbarService.showInfo('Some changes might not be visible until you have saved changes.');
			}
		});
	}

	hasChanges(): boolean {
		return this.editing();
	}

	onBeforeUnload(event: BeforeUnloadEvent): void {
		if (this.editing()) {
			event.preventDefault();
		}
	}

	async openCatalog(): Promise<void> {
		const result = await this.dialog.openNonModal<WidgetCatalogDialogData, WidgetCatalogDialogResult | null>(
			WidgetCatalogDialogComponent,
			{
				statCards: this.store.statCards(),
				charts: this.store.charts(),
			},
			{
				height: '75vh',
				width: '65vw',
			},
		);
		if (!result) return;

		const isStatCard = mapToExChartType(result.catalogItem.type) === 'statCard';
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
