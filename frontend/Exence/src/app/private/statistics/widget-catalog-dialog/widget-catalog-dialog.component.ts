import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
	GROUP_WIDGET_TYPES,
	WIDGET_CATALOG,
	WidgetCatalogItem,
	WidgetType,
} from '../../../data-model/modules/statistics/widget-config.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { InfoButtonComponent } from '../../../shared/info-button/info-button.component';
import { toRawValueSignal } from '../../../shared/util/utils';
import { ChartWidget, StatCardWidget } from '../../../data-model/modules/statistics/Widget';

export interface WidgetCatalogDialogData {
	statCards: StatCardWidget[];
	charts: ChartWidget[];
}

@Component({
	selector: 'ex-widget-catalog-dialog',
	templateUrl: './widget-catalog-dialog.component.html',
	styleUrl: './widget-catalog-dialog.component.scss',
	imports: [
		ReactiveFormsModule,
		MatTabsModule,
		MatIconModule,
		MatCardModule,
		MatTooltipModule,
		MatDialogClose,
		DialogCardComponent,
		ButtonComponent,
		InfoButtonComponent,
	],
})
export class WidgetCatalogDialogComponent extends DialogComponent<WidgetCatalogDialogData, WidgetCatalogItem | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	readonly themeService = inject(DisplayThemeService);

	data = this.dialogRef.value;

	readonly catalog = WIDGET_CATALOG;
	readonly cardTypes = GROUP_WIDGET_TYPES.card;

	selectedTabIndex = 0;
	selectedWidget = this.fb.control<WidgetCatalogItem | null>(null, [Validators.required]);
	selectedWidgetValue = toRawValueSignal(this.selectedWidget);

	constructor() {
		super(inject(DialogRef));
	}

	statCardSelectionDisabled(type: WidgetType): boolean {
		return this.cardTypes.includes(type) && this.data.statCards.length === 4;
	}

	create(): void {
		const selected = this.selectedWidgetValue();
		if (!selected) return;
		this.dialogRef.close(selected);
	}

	selectWidget(widget: WidgetCatalogItem): void {
		if (this.statCardSelectionDisabled(widget.type)) return;
		if (this.selectedWidgetValue()?.type === widget.type) this.selectedWidget.setValue(null);
		else this.selectedWidget.setValue(widget);
	}
}
