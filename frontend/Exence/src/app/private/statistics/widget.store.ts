import { inject, resource } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { GridsterItemConfig } from 'angular-gridster2';
import { Timeframe } from '../../data-model/modules/statistics/Timeframe';
import { UpdateLayoutRequest } from '../../data-model/modules/statistics/UpdateLayoutRequest';
import { ChartWidget, StatCardWidget, Widget } from '../../data-model/modules/statistics/Widget';
import { mapToExChartType } from '../../data-model/modules/statistics/widget-config.model';
import { WidgetLayoutResponse } from '../../data-model/modules/statistics/WidgetLayoutResponse';
import { WidgetSetting } from '../../data-model/modules/statistics/WidgetSetting';
import { EditChartDialogResult } from './edit-chart-dialog/edit-chart-dialog.component';
import { StatisticService } from './statistic.service';
import { WidgetCatalogDialogResult } from './widget-catalog-dialog/widget-catalog-dialog.component';

export type StatCardGridsterItem = StatCardWidget & { x: number; y: number; cols: number; rows: number };

export interface WidgetLayoutState {
	statCards: StatCardGridsterItem[];
	charts: ChartWidget[];
}

const initialState: WidgetLayoutState = {
	statCards: [],
	charts: [],
};

export const WidgetStore = signalStore(
	withState(initialState),

	withProps((store, statisticService = inject(StatisticService)) => ({
		layoutResource: resource<undefined, WidgetLayoutResponse>({
			loader: async () => {
				const { statCards, charts } = await statisticService.getLayout();
				patchState(store, {
					statCards: statCards.map(c => ({ ...c, x: c.displayOrder, y: 0, cols: 1, rows: 1 })),
					charts,
				});
			},
		}),
	})),

	withMethods((store, statisticService = inject(StatisticService)) => ({
		async addWidget(
			dialogResult: WidgetCatalogDialogResult,
			nextFreePosition: GridsterItemConfig | null,
		): Promise<void> {
			const isStatCard = mapToExChartType(dialogResult.catalogItem.type) === 'statCard';

			const request: Widget = {
				type: dialogResult.catalogItem.type,
				title: dialogResult.title,
				timeframe: Timeframe.YEAR_TO_DATE,
				settings: dialogResult.settings,
			};
			if (isStatCard) {
				request.displayOrder = store.statCards().length;
			} else {
				request.x = nextFreePosition?.x ?? 0;
				request.y = nextFreePosition?.y ?? 0;
				request.cols = nextFreePosition?.cols ?? 1;
				request.rows = nextFreePosition?.rows ?? 1;
			}

			const { statCards, charts } = await statisticService.createWidget(request);

			patchState(store, {
				statCards: statCards.map(c => ({ ...c, x: c.displayOrder, y: 0, cols: 1, rows: 1 })),
				charts,
			});
		},

		deleteWidget(widget: StatCardGridsterItem | ChartWidget): void {
			const isStatCard = 'displayOrder' in widget;
			const statCards = isStatCard
				? store
						.statCards()
						.filter(card => card.id !== widget.id)
						.map((card, i) => ({ ...card, x: i }))
				: store.statCards();
			const charts = isStatCard ? store.charts() : store.charts().filter(chart => chart.id !== widget.id);

			patchState(store, {
				statCards,
				charts,
			});
		},

		applyChangesOnWidget(widget: ChartWidget | StatCardGridsterItem, changes: EditChartDialogResult): void {
			const isStatCard = 'displayOrder' in widget;
			const statCards = isStatCard
				? store
						.statCards()
						.map(card =>
							card.id === widget.id
								? { ...card, title: changes.title, settings: changes.settings }
								: card,
						)
				: store.statCards();
			const charts = isStatCard
				? store.charts()
				: store
						.charts()
						.map(chart =>
							chart.id === widget.id
								? { ...chart, title: changes.title, settings: changes.settings }
								: chart,
						);

			patchState(store, {
				statCards,
				charts,
			});
		},

		cancelLayout(): void {
			store.layoutResource.reload();
		},

		async saveLayout(): Promise<void> {
			const request: UpdateLayoutRequest = {
				statCards: store.statCards().map(c => ({
					id: c.id,
					displayOrder: c.x,
					title: c.title,
					settings: c.settings as Record<WidgetSetting, unknown>,
				})),
				charts: store.charts().map(c => ({
					id: c.id,
					x: c.x,
					y: c.y,
					cols: c.cols,
					rows: c.rows,
					title: c.title,
					settings: c.settings as Record<WidgetSetting, unknown>,
				})),
			};

			await statisticService.updateLayout(request);
			store.layoutResource.reload();
		},
	})),
);
