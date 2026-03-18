import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { WIDGET_CATALOG } from '../../../data-model/modules/statistics/widget-config.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfoButtonComponent } from '../../../shared/info-button/info-button.component';
import { DisplayThemeService } from '../../../shared/display-theme.service';

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
		DialogCardComponent,
		ButtonComponent,
		InfoButtonComponent,
		ConfirmExitDialogDirective,
	],
})
export class WidgetCatalogDialogComponent extends DialogComponent<void, boolean> {
	private readonly fb = inject(NonNullableFormBuilder);
	readonly themeService = inject(DisplayThemeService);

	readonly catalog = WIDGET_CATALOG;

	selectedIndex = 0;
	form = this.fb.group({});

	constructor() {
		super(inject(DialogRef));
	}

	create(): void {}
}
