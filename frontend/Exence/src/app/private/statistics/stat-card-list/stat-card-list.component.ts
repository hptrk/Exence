import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import {
	EditChartDialogComponent,
	EditChartDialogData,
	EditChartDialogResult,
} from '../edit-chart-dialog/edit-chart-dialog.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { StatCardGridsterItem, WidgetStore } from '../widget.store';

@Component({
	selector: 'ex-stat-card-list',
	templateUrl: './stat-card-list.component.html',
	styleUrl: './stat-card-list.component.scss',
	imports: [StatCardComponent, Gridster, GridsterItem, ButtonComponent],
})
export class StatCardListComponent {
	private readonly store = inject(WidgetStore);
	private readonly dialog = inject(DialogService);

	data = input.required<StatCardGridsterItem[]>();
	editing = input.required<boolean>();

	private readonly gridster = viewChild.required(Gridster);

	readonly scrollLeft = signal<number>(0);

	readonly colCount = computed(() => Math.min(this.data().length, 4));
	readonly gridMinWidth = computed(() => this.colCount() * 350 + Math.max(this.colCount() - 1, 0) * 21);

	options = computed<GridsterConfig>(() => ({
		gridType: GridType.VerticalFixed,
		displayGrid: DisplayGrid.None,
		mobileBreakpoint: 0,
		fixedRowHeight: 175,
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

	async openEditWidgetDialog(card: StatCardGridsterItem): Promise<void> {
		const result = await this.dialog.openNonModal<EditChartDialogData, EditChartDialogResult | null>(
			EditChartDialogComponent,
			{
				title: card.title,
				type: card.type,
				settings: { ...card.settings },
			},
			{
				width: '500px',
			},
		);
		if (!result) return;
		this.store.applyChangesOnWidget(card, result);
	}

	onCardsScroll(event: Event): void {
		this.scrollLeft.set((event.target as HTMLElement).scrollLeft);
	}

	deleteCard(card: StatCardGridsterItem): void {
		this.store.deleteWidget(card);
	}

	getFirstPossiblePosition(): GridsterItemConfig {
		const item: GridsterItemConfig = { cols: 1, rows: 1, x: 0, y: 0 };
		return this.gridster().getFirstPossiblePosition(item);
	}
}
