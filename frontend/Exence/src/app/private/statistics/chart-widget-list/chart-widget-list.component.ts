import { Component, effect, input, signal, viewChild } from '@angular/core';
import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { ChartWidget } from '../../../data-model/modules/statistics/Widget';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';

@Component({
	selector: 'ex-chart-widget-list',
	templateUrl: './chart-widget-list.component.html',
	styleUrl: './chart-widget-list.component.scss',
	imports: [ChartWidgetComponent, Gridster, GridsterItem, ButtonComponent],
})
export class ChartWidgetListComponent {
	data = input.required<ChartWidget[]>();
	editing = input.required<boolean>();

	private readonly gridster = viewChild.required(Gridster);

	options = signal<GridsterConfig>({
		gridType: GridType.VerticalFixed,
		displayGrid: DisplayGrid.None,
		fixedRowHeight: 500,
		mobileBreakpoint: 768,
		maxCols: 2,
		maxRows: 25,
		pushItems: true,
		swap: false,
		dropOverItems: true,
		setGridSize: true,
		delayStart: 100,
		delayStartTouch: 100,
		draggable: {
			enabled: false,
			delayStart: 0,
			dragHandleClass: 'dragger',
			ignoreContent: true,
		},
		resizable: {
			enabled: false,
		},
		margin: 21,
		outerMarginBottom: 0,
		outerMarginTop: 0,
		outerMarginLeft: 0,
		outerMarginRight: 10,
		outerMargin: true,
	});

	constructor() {
		effect(() => {
			this.options.update(currOptions => ({
				...currOptions,
				draggable: { ...currOptions.draggable, enabled: this.editing() },
				resizable: { ...currOptions.resizable, enabled: this.editing() },
			}));
		});
	}

	removeItem($event: MouseEvent | TouchEvent, _item: GridsterItemConfig): void {
		$event.stopPropagation();
		$event.preventDefault();
		// this.cards.splice(this.cards.indexOf(item), 1);
		// TODO remove logic
	}

	getFirstPossiblePosition(): GridsterItemConfig {
		const item: GridsterItemConfig = { cols: 1, rows: 1, x: 0, y: 0 };
		return this.gridster().getFirstPossiblePosition(item);
	}
}
