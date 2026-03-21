import { inject, resource } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { GridsterItemConfig } from 'angular-gridster2';
import { UpdateLayoutRequest } from '../../data-model/modules/statistics/UpdateLayoutRequest';
import { ChartWidget, StatCardWidget, Widget } from '../../data-model/modules/statistics/Widget';
import { mapToExChartType, WidgetCatalogItem } from '../../data-model/modules/statistics/widget-config.model';
import { WidgetLayoutResponse } from '../../data-model/modules/statistics/WidgetLayoutResponse';
import { StatisticService } from './statistic.service';

export interface WidgetLayoutState {
	statCards: StatCardWidget[];
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
					statCards,
					charts,
				});
			},
		}),
	})),

	withMethods((store, statisticService = inject(StatisticService)) => ({
		async addWidget(item: WidgetCatalogItem, nextFreePosition: GridsterItemConfig | null): Promise<void> {
			const isStatCard = mapToExChartType(item.type) === 'statCard';

			const request: Widget = {
				type: item.type,
				title: item.title,
				timeframe: 'YTD',
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
				statCards,
				charts,
			});
		},

		deleteWidget(widget: StatCardWidget | ChartWidget): void {
			const isStatCard = 'displayOrder' in widget;
			const statCards = isStatCard ? store.statCards().filter(card => card.id !== widget.id) : store.statCards();
			const charts = isStatCard ? store.charts() : store.charts().filter(chart => chart.id !== widget.id);

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
				statCards: store.statCards().map((c, i) => ({ id: c.id, displayOrder: i })),

				charts: store.charts().map(c => ({
					id: c.id,
					x: c.x,
					y: c.y,
					cols: c.cols,
					rows: c.rows,
				})),
			};

			await statisticService.updateLayout(request);
			store.layoutResource.reload();
		},
	})),
);
