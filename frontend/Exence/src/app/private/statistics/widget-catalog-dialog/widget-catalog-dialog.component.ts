import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WIDGET_CATALOG, WidgetCatalogItem } from '../../../data-model/modules/statistics/widget-config.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { InfoButtonComponent } from '../../../shared/info-button/info-button.component';
import { toRawValueSignal } from '../../../shared/util/utils';

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
		ConfirmExitDialogDirective,
	],
})
export class WidgetCatalogDialogComponent extends DialogComponent<void, WidgetCatalogItem | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	readonly themeService = inject(DisplayThemeService);

	readonly catalog = WIDGET_CATALOG;

	selectedTabIndex = 0;
	form = this.fb.group({
		selectedWidget: this.fb.control<WidgetCatalogItem | null>(null, [Validators.required]),
	});
	formValueSignal = toRawValueSignal(this.form);

	constructor() {
		super(inject(DialogRef));
	}

	create(): void {
		const selected = this.formValueSignal().selectedWidget;
		if (!selected) return;
		this.dialogRef.close(selected);
	}
}
