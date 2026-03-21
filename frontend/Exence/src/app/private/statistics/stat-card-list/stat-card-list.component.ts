import { Component, computed, inject, input, viewChild } from '@angular/core';
import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { StatCardWidget } from '../../../data-model/modules/statistics/Widget';
import { ButtonComponent } from '../../../shared/button/button.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { WidgetStore } from '../widget.store';
import { WidgetType } from '../../../data-model/modules/statistics/widget-config.model';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';

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
}

@Component({
	selector: 'ex-stat-card-list',
	templateUrl: './stat-card-list.component.html',
	styleUrl: './stat-card-list.component.scss',
	imports: [StatCardComponent, Gridster, GridsterItem, ButtonComponent],
})
export class StatCardListComponent {
	private readonly store = inject(WidgetStore);

	data = input.required<StatCardWidget[]>();
	editing = input.required<boolean>();

	private readonly gridster = viewChild.required(Gridster);

	options = computed<GridsterConfig>(() => ({
		gridType: GridType.VerticalFixed,
		displayGrid: DisplayGrid.None,
		mobileBreakpoint: 0,
		fixedRowHeight: 250,
		maxCols: 5,
		minCols: 4,
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

	deleteCard(card: StatCardGridsterInfo): void {
		this.store.deleteWidget(card.cardData);
	}

	getFirstPossiblePosition(): GridsterItemConfig {
		const item: GridsterItemConfig = { cols: 1, rows: 1, x: 0, y: 0 };
		return this.gridster().getFirstPossiblePosition(item);
	}
}
