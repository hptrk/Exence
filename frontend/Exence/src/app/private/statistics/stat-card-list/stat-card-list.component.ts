import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import { StatCardWidget } from '../../../data-model/modules/statistics/Widget';
import { WidgetType } from '../../../data-model/modules/statistics/widget-config.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { EditChartDialogComponent } from '../edit-chart-dialog/edit-chart-dialog.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { WidgetStore } from '../widget.store';

interface StatCardGridsterInfo {
	id: number;
	type: WidgetType;
	title: string;
	info: string;
	timeframe: Timeframe;
	cols: number;
	rows: number;
	x: number;
	y: number;
	cardData: StatCardWidget;
	settings?: Record<string, unknown>;
}

@Component({
	selector: 'ex-stat-card-list',
	templateUrl: './stat-card-list.component.html',
	styleUrl: './stat-card-list.component.scss',
	imports: [StatCardComponent, Gridster, GridsterItem, ButtonComponent],
})
export class StatCardListComponent {
	private readonly store = inject(WidgetStore);
	private readonly dialog = inject(DialogService);

	data = input.required<StatCardWidget[]>();
	editing = input.required<boolean>();

	private readonly gridster = viewChild.required(Gridster);

	readonly scrollLeft = signal<number>(0);

	readonly colCount = computed(() => Math.min(this.cards().length, 4));
	readonly gridMinWidth = computed(() => this.colCount() * 350 + Math.max(this.colCount() - 1, 0) * 21);

	options = computed<GridsterConfig>(() => ({
		gridType: GridType.VerticalFixed,
		displayGrid: DisplayGrid.None,
		mobileBreakpoint: 0,
		fixedRowHeight: 250,
		maxCols: this.colCount(),
		minCols: this.colCount(),
		maxRows: 1,
		pushItems: false,
		swap: true,
		dropOverItems: true,
		delayStart: 100,
		delayStartTouch: 100,
		scrollToNewItems: true,
		draggable: {
			enabled: this.editing(),
			delayStart: 100,
			dragHandleClass: 'dragger',
			ignoreContent: true,
		},
		margin: 21,
		outerMargin: false,
	}));

	cards = computed<StatCardGridsterInfo[]>(() =>
		this.data().map(card => ({
			id: card.id,
			type: card.type,
			title: card.title,
			info: card.info,
			timeframe: card.timeframe,
			cols: 1,
			rows: 1,
			x: card.displayOrder,
			y: 0,
			cardData: card,
		})),
	);

	async openEditWidgetDialog(card: StatCardGridsterInfo): Promise<void> {
		const result = await this.dialog.openNonModal(
			EditChartDialogComponent,
			{
				title: card.title,
				type: card.type,
				settings: { ...card.settings },
			},
			undefined,
		);
		if (!result) return;
		this.store.applyChangesOnWidget(card.cardData, result);
	}

	onCardsScroll(event: Event): void {
		this.scrollLeft.set((event.target as HTMLElement).scrollLeft);
	}

	deleteCard(card: StatCardGridsterInfo): void {
		this.store.deleteWidget(card.cardData);
	}

	getFirstPossiblePosition(): GridsterItemConfig {
		const item: GridsterItemConfig = { cols: 1, rows: 1, x: 0, y: 0 };
		return this.gridster().getFirstPossiblePosition(item);
	}
}
