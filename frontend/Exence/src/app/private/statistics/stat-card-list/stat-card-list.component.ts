import { Component, computed, input } from '@angular/core';
import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { StatCardWidget } from '../../../data-model/modules/statistics/Widget';
import { ButtonComponent } from '../../../shared/button/button.component';
import { EmptyStatisticCardComponent } from '../empty-statistic-card.component';
import { StatCardComponent } from '../stat-card/stat-card.component';

@Component({
	selector: 'ex-stat-card-list',
	templateUrl: './stat-card-list.component.html',
	styleUrl: './stat-card-list.component.scss',
	imports: [EmptyStatisticCardComponent, StatCardComponent, Gridster, GridsterItem, ButtonComponent],
})
export class StatCardListComponent {
	data = input.required<StatCardWidget[]>();

	readonly options: GridsterConfig = {
		gridType: GridType.VerticalFixed,
		displayGrid: DisplayGrid.None,
		mobileBreakpoint: 0,
		fixedRowHeight: 250,
		maxCols: 4,
		minCols: 4,
		maxRows: 1,
		pushItems: false,
		swap: true,
		dropOverItems: true,
		delayStart: 100,
		delayStartTouch: 100,
		scrollToNewItems: true,
		draggable: {
			enabled: true, // TODO based on the state of edit mode
			delayStart: 100,
			dragHandleClass: 'dragger',
			ignoreContent: true,
			// TODO save to temp state for save changes submission
			stop: (item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent): Promise<unknown> | void =>
				console.info('eventStop', item, itemComponent, event),
		},
		// TODO save to temp state for save changes submission
		itemRemovedCallback: (item, itemComponent) => {
			console.info('Item removed:', item, itemComponent);
		},

		margin: 21,
		outerMargin: false,
	};

	cards = computed(() =>
		this.data().map(card => ({
			id: card.id,
			type: card.type,
			title: card.title,
			timeframe: card.timeframe,
			cols: 1,
			rows: 1,
			x: card.displayOrder,
			y: 0,
			cardData: card,
		})),
	);
	numberOfCards = computed(() => this.data().length);
}
