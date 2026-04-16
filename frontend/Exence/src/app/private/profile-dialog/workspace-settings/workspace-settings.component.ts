import { Component, computed, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoService } from '@jsverse/transloco';
import { WorkspaceSettingsGet } from '../../../data-model/modules/workspaces/WorkspaceSettingsGet';
import { ButtonComponent } from '../../../shared/button/button.component';
import { CurrencyService } from '../../../shared/currency.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { WorkspaceService } from '../../../shared/workspace.service';
import { CurrencyInfo, CurrencySelectComponent } from '../user-settings/currency-select/currency-select.component';
import { WorkspaceListComponent } from './workspace-list/workspace-list.component';

@Component({
	selector: 'ex-workspace-settings',
	templateUrl: './workspace-settings.component.html',
	styleUrl: './workspace-settings.component.scss',
	imports: [
		MatProgressSpinnerModule,
		MatDividerModule,
		CurrencySelectComponent,
		ButtonComponent,
		TranslatePipe,
		WorkspaceListComponent,
	],
})
export class WorkspaceSettingsComponent {
	private readonly workspaceService = inject(WorkspaceService);
	private readonly currencyService = inject(CurrencyService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);

	saving = signal(false);
	workspaceSettings = signal<WorkspaceSettingsGet | null>(null);
	currencyInfo = signal<CurrencyInfo | null>(null);

	initialCurrencyInfo = computed<CurrencyInfo | null>(() => {
		const s = this.workspaceSettings();
		return s ? { baseCurrency: s.baseCurrency, showBaseCurrency: s.showBaseCurrency } : null;
	});

	hasChanges = computed<boolean>(() => !!this.currencyInfo());

	constructor() {
		this.workspaceService.getSettings().then(r => this.workspaceSettings.set(r));
	}

	async save(): Promise<void> {
		this.saving.set(true);
		let response: WorkspaceSettingsGet;
		try {
			response = await this.workspaceService.updateSettings({
				baseCurrency: this.currencyInfo()!.baseCurrency,
				showBaseCurrency: this.currencyInfo()!.showBaseCurrency,
			});
		} finally {
			this.saving.set(false);
		}
		this.snackbarService.showSuccess(this.translocoService.translate('profile.workspaceSettings.success'));
		this.currencyService.setBaseCurrency(response!.baseCurrency);
		this.currencyService.useBaseCurrency(response!.showBaseCurrency);
		this.currencyInfo.set(null);
		this.workspaceSettings.set(response!);
	}

	async cancel(): Promise<void> {
		this.workspaceSettings.set(await this.workspaceService.getSettings());
		this.currencyInfo.set(null);
	}
}
