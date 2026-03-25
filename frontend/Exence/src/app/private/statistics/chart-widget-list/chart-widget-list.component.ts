import { Component, effect, inject, input, signal, viewChild } from '@angular/core';
import {
	CompactType,
	DisplayGrid,
	Gridster,
	GridsterConfig,
	GridsterItem,
	GridsterItemConfig,
	GridType,
} from 'angular-gridster2';
import { ChartWidget } from '../../../data-model/modules/statistics/Widget';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';
import {
	EditChartDialogComponent,
	EditChartDialogData,
	EditChartDialogResult,
} from '../edit-chart-dialog/edit-chart-dialog.component';
import { WidgetStore } from '../widget.store';

@Component({
	selector: 'ex-chart-widget-list',
	templateUrl: './chart-widget-list.component.html',
	styleUrl: './chart-widget-list.component.scss',
	imports: [ChartWidgetComponent, Gridster, GridsterItem, ButtonComponent],
})
export class ChartWidgetListComponent {
	private readonly store = inject(WidgetStore);
	private readonly dialog = inject(DialogService);

	data = input.required<ChartWidget[]>();
	editing = input.required<boolean>();

	private readonly gridster = viewChild.required(Gridster);

	options = signal<GridsterConfig>({
		gridType: GridType.VerticalFixed,
		compactType: CompactType.CompactUpAndLeft,
		displayGrid: DisplayGrid.None,
		fixedRowHeight: 575,
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
			start: () => {
				this.options.update(o => ({ ...o, resizable: { ...o.resizable, enabled: false } }));
			},
			stop: () => {
				this.options.update(o => ({ ...o, resizable: { ...o.resizable, enabled: this.editing() } }));
			},
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

	async openEditWidgetDialog(widget: ChartWidget): Promise<void> {
		const result = await this.dialog.openNonModal<EditChartDialogData, EditChartDialogResult | null>(
			EditChartDialogComponent,
			{
				title: widget.title,
				type: widget.type,
				settings: { ...widget.settings },
			},
			{
				width: '500px',
			},
		);
		if (!result) return;
		this.store.applyChangesOnWidget(widget, result);
	}

	deleteWidget(widget: ChartWidget): void {
		this.store.deleteWidget(widget);
	}

	getFirstPossiblePosition(): GridsterItemConfig {
		const item: GridsterItemConfig = { cols: 1, rows: 1, x: 0, y: 0 };
		return this.gridster().getFirstPossiblePosition(item);
	}
}
