import { Component, input, viewChildren } from '@angular/core';
import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { ChartWidget } from '../../../data-model/modules/statistics/Widget';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
	selector: 'ex-chart-widget-list',
	templateUrl: './chart-widget-list.component.html',
	styleUrl: './chart-widget-list.component.scss',
	imports: [ChartWidgetComponent, Gridster, GridsterItem, ButtonComponent],
})
export class ChartWidgetListComponent {
	data = input.required<ChartWidget[]>();

	private readonly widgets = viewChildren(ChartWidgetComponent);

	readonly options: GridsterConfig = {
		gridType: GridType.VerticalFixed,
		displayGrid: DisplayGrid.None,
		fixedRowHeight: 500,
		mobileBreakpoint: 768,
		maxCols: 2,
		maxRows: 25,
		pushItems: true,
		swap: false,
		dropOverItems: true,
		delayStart: 100,
		delayStartTouch: 100,

		draggable: {
			enabled: true, // TODO based on the state of edit mode
			delayStart: 0,
			dragHandleClass: 'dragger',
			ignoreContentClass: 'exclude-this-item-from-dragging',
			ignoreContent: true,
			stop: (item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent): Promise<unknown> | void =>
				console.info('eventStop', item, itemComponent, event),
			start: (item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent): void =>
				console.info('eventStart', item, itemComponent, event),
		},
		itemInitCallback: (item, itemComponent) => {
			console.info('Item added/initialized:', item, itemComponent);
		},
		itemRemovedCallback: (item, itemComponent) => {
			console.info('Item removed:', item, itemComponent);
		},
		resizable: {
			enabled: true,
			stop: () => this.resizeChart(),
		},
		margin: 21,
		outerMargin: false,
	};

	// TODO for there a storage in the memory will be needed (temporary state that will be sent to the backend on save, first to parent with an event, might need to store it in a service though)
	addItem(): void {
		// const newItem: GridsterItemConfig = { cols: 1, rows: 1, y: 0, x: 0 };
		// this.cards.push(newItem);
		// TODO add logic
	}

	removeItem($event: MouseEvent | TouchEvent, _item: GridsterItemConfig): void {
		$event.stopPropagation();
		$event.preventDefault();
		// this.cards.splice(this.cards.indexOf(item), 1);
		// TODO remove logic
	}

	private resizeChart(): void {
		window.dispatchEvent(new Event('resize'));
		this.widgets().forEach(widget => widget.triggerRedraw());
	}
}
