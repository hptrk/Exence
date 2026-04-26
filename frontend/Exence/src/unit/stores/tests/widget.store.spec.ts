import { provideZonelessChangeDetection, ɵEffectScheduler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { NEVER } from 'rxjs';

import { ChartWidget } from '../../../app/data-model/modules/statistics/ChartWidget';
import { StatCardWidget } from '../../../app/data-model/modules/statistics/StatCardWidget';
import { Timeframe } from '../../../app/data-model/modules/statistics/Timeframe';
import { WidgetLayoutResponse } from '../../../app/data-model/modules/statistics/WidgetLayoutResponse';
import { WidgetSetting } from '../../../app/data-model/modules/statistics/WidgetSetting';
import {
	WidgetCatalogItem,
	StatisticsWidgetType,
} from '../../../app/data-model/modules/statistics/widget-config.model';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { StatisticService } from '../../../app/private/statistics/statistic.service';
import { WidgetCatalogDialogResult } from '../../../app/private/statistics/widget-catalog-dialog/widget-catalog-dialog.component';
import { WidgetStore } from '../../../app/private/statistics/widget.store';
import { CurrencyService } from '../../../app/shared/currency.service';

// Fixtures
const mockStatCard: StatCardWidget = {
	id: 1,
	type: StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD,
	title: 'Expense Frequency',
	timeframe: Timeframe.YEAR_TO_DATE,
	displayOrder: 0,
};

const mockStatCard2: StatCardWidget = {
	id: 2,
	type: StatisticsWidgetType.INCOME_FREQUENCY_STATCARD,
	title: 'Income Frequency',
	timeframe: Timeframe.YEAR_TO_DATE,
	displayOrder: 1,
};

const mockChart: ChartWidget = {
	id: 10,
	type: StatisticsWidgetType.INCOME_TREND,
	title: 'Income Trend',
	timeframe: Timeframe.YEAR_TO_DATE,
	x: 0,
	y: 0,
	cols: 2,
	rows: 2,
};

const emptyLayout: WidgetLayoutResponse = { statCards: [], charts: [] };

function makeStatCardDialogResult(title = 'New Stat Card'): WidgetCatalogDialogResult {
	return {
		catalogItem: {
			type: StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD,
		} as WidgetCatalogItem,
		title,
		settings: {} as Record<WidgetSetting, unknown>,
	};
}

function makeChartDialogResult(title = 'New Chart'): WidgetCatalogDialogResult {
	return {
		catalogItem: {
			type: StatisticsWidgetType.INCOME_TREND,
		} as WidgetCatalogItem,
		title,
		settings: {} as Record<WidgetSetting, unknown>,
	};
}

// WidgetStore
describe('WidgetStore', () => {
	let store: InstanceType<typeof WidgetStore>;
	let mockStatisticService: jasmine.SpyObj<StatisticService>;

	beforeEach(() => {
		mockStatisticService = jasmine.createSpyObj('StatisticService', ['getLayout', 'createWidget', 'updateLayout']);
		mockStatisticService.getLayout.and.resolveTo(emptyLayout);
		mockStatisticService.createWidget.and.resolveTo(emptyLayout);
		mockStatisticService.updateLayout.and.resolveTo(emptyLayout);

		const mockTranslocoService = {
			langChanges$: NEVER,
			getActiveLang: () => 'en',
		};

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				WidgetStore,
				{ provide: StatisticService, useValue: mockStatisticService },
				{ provide: TranslocoService, useValue: mockTranslocoService },
				CurrencyService,
			],
		});

		store = TestBed.inject(WidgetStore);
	});

	// Initial state
	describe('initial state', () => {
		it('statCards starts as an empty array', () => {
			expect(store.statCards()).toEqual([]);
		});

		it('charts starts as an empty array', () => {
			expect(store.charts()).toEqual([]);
		});
	});

	// addWidget - stat card
	describe('addWidget (stat card)', () => {
		const responseWithStatCard: WidgetLayoutResponse = {
			statCards: [mockStatCard],
			charts: [],
		};

		beforeEach(() => {
			mockStatisticService.createWidget.and.resolveTo(responseWithStatCard);
		});

		it('calls createWidget with displayOrder equal to current statCards length', async () => {
			await store.addWidget(makeStatCardDialogResult(), null);
			expect(mockStatisticService.createWidget).toHaveBeenCalledOnceWith(
				jasmine.objectContaining({ displayOrder: 0, type: StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD }),
			);
		});

		it('patches statCards from service response with x mapped from displayOrder', async () => {
			await store.addWidget(makeStatCardDialogResult(), null);
			const cards = store.statCards();
			expect(cards.length).toBe(1);
			expect(cards[0].x).toBe(mockStatCard.displayOrder);
			expect(cards[0].y).toBe(0);
			expect(cards[0].cols).toBe(1);
			expect(cards[0].rows).toBe(1);
		});

		it('uses the correct title from dialogResult', async () => {
			await store.addWidget(makeStatCardDialogResult('Custom Title'), null);
			expect(mockStatisticService.createWidget).toHaveBeenCalledOnceWith(
				jasmine.objectContaining({ title: 'Custom Title' }),
			);
		});
	});

	// addWidget - chart
	describe('addWidget (chart)', () => {
		const responseWithChart: WidgetLayoutResponse = {
			statCards: [],
			charts: [mockChart],
		};

		beforeEach(() => {
			mockStatisticService.createWidget.and.resolveTo(responseWithChart);
		});

		it('calls createWidget with x/y/cols/rows from nextFreePosition', async () => {
			const position = { x: 2, y: 1, cols: 3, rows: 2 };
			await store.addWidget(makeChartDialogResult(), position);
			expect(mockStatisticService.createWidget).toHaveBeenCalledOnceWith(
				jasmine.objectContaining({ x: 2, y: 1, cols: 3, rows: 2 }),
			);
		});

		it('falls back to x=0, y=0, cols=1, rows=1 when nextFreePosition is null', async () => {
			await store.addWidget(makeChartDialogResult(), null);
			expect(mockStatisticService.createWidget).toHaveBeenCalledOnceWith(
				jasmine.objectContaining({ x: 0, y: 0, cols: 1, rows: 1 }),
			);
		});

		it('patches charts from service response', async () => {
			await store.addWidget(makeChartDialogResult(), null);
			expect(store.charts().length).toBe(1);
			expect(store.charts()[0].id).toBe(mockChart.id);
		});
	});

	// deleteWidget - stat card
	describe('deleteWidget (stat card)', () => {
		beforeEach(() => {
			const layout: WidgetLayoutResponse = { statCards: [mockStatCard, mockStatCard2], charts: [mockChart] };
			mockStatisticService.createWidget.and.resolveTo(layout);
			// Patch state directly by simulating the layout load
			const spy = mockStatisticService.getLayout;
			spy.and.resolveTo(layout);
		});

		it('removes the stat card by id and re-indexes remaining cards', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [mockStatCard, mockStatCard2], charts: [] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			const cardToDelete = store.statCards().find(c => c.id === mockStatCard.id)!;
			store.deleteWidget(cardToDelete);

			const remaining = store.statCards();
			expect(remaining.find(c => c.id === mockStatCard.id)).toBeUndefined();
			expect(remaining[0].x).toBe(0);
		});

		it('leaves charts unchanged when deleting a stat card', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [mockStatCard], charts: [mockChart] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			const cardToDelete = store.statCards()[0];
			store.deleteWidget(cardToDelete);

			expect(store.charts().length).toBe(1);
			expect(store.charts()[0].id).toBe(mockChart.id);
		});
	});

	// deleteWidget - chart
	describe('deleteWidget (chart)', () => {
		it('removes the chart by id and leaves statCards unchanged', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [mockStatCard], charts: [mockChart] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			store.deleteWidget(store.charts()[0]);

			expect(store.charts().find(c => c.id === mockChart.id)).toBeUndefined();
			expect(store.statCards().length).toBe(1);
		});
	});

	// applyChangesOnWidget - stat card
	describe('applyChangesOnWidget (stat card)', () => {
		it('updates title and settings for the matching stat card', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [mockStatCard, mockStatCard2], charts: [] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			const card = store.statCards().find(c => c.id === mockStatCard.id)!;
			store.applyChangesOnWidget(card, {
				title: 'Changed Title',
				settings: {} as Record<WidgetSetting, unknown>,
			});

			const updated = store.statCards().find(c => c.id === mockStatCard.id)!;
			expect(updated.title).toBe('Changed Title');
		});

		it('leaves other stat cards unchanged', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [mockStatCard, mockStatCard2], charts: [] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			const card = store.statCards().find(c => c.id === mockStatCard.id)!;
			store.applyChangesOnWidget(card, { title: 'Changed', settings: {} as Record<WidgetSetting, unknown> });

			const unchanged = store.statCards().find(c => c.id === mockStatCard2.id)!;
			expect(unchanged.title).toBe(mockStatCard2.title);
		});
	});

	// applyChangesOnWidget - chart
	describe('applyChangesOnWidget (chart)', () => {
		it('updates title and settings for the matching chart', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [], charts: [mockChart] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			const chart = store.charts()[0];
			store.applyChangesOnWidget(chart, {
				title: 'Updated Chart',
				settings: {} as Record<WidgetSetting, unknown>,
			});

			expect(store.charts()[0].title).toBe('Updated Chart');
		});
	});

	// saveLayout
	describe('saveLayout', () => {
		it('calls statisticService.updateLayout with mapped stat card data', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [mockStatCard], charts: [] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			await store.saveLayout();

			expect(mockStatisticService.updateLayout).toHaveBeenCalledWith(
				jasmine.objectContaining({
					statCards: jasmine.arrayContaining([jasmine.objectContaining({ id: mockStatCard.id })]),
				}),
			);
		});

		it('calls statisticService.updateLayout with mapped chart data', async () => {
			mockStatisticService.getLayout.and.resolveTo({ statCards: [], charts: [mockChart] });
			store.layoutResource.reload();
			await new Promise(resolve => setTimeout(resolve));

			await store.saveLayout();

			expect(mockStatisticService.updateLayout).toHaveBeenCalledWith(
				jasmine.objectContaining({
					charts: jasmine.arrayContaining([jasmine.objectContaining({ id: mockChart.id })]),
				}),
			);
		});

		it('reloads layoutResource after saving', async () => {
			spyOn(store.layoutResource, 'reload');
			await store.saveLayout();
			expect(store.layoutResource.reload).toHaveBeenCalled();
		});
	});

	// currency change effect
	describe('currency change effect', () => {
		it('reloads layoutResource when baseCurrency changes', () => {
			spyOn(store.layoutResource, 'reload');
			TestBed.inject(CurrencyService).setBaseCurrency(SupportedCurrency.EUR);
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.layoutResource.reload).toHaveBeenCalled();
		});

		it('does not reload layoutResource when currency has not changed', () => {
			spyOn(store.layoutResource, 'reload');
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.layoutResource.reload).not.toHaveBeenCalled();
		});
	});
});
