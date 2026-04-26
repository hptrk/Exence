import { Component, computed, inject } from '@angular/core';
import { DebtCreate } from '../../data-model/modules/debt/DebtCreate';
import { DebtType } from '../../data-model/modules/debt/DebtType';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CreateDebtDialogComponent } from './create-debt-dialog/create-debt-dialog.component';
import { DebtListComponent } from './debt-list/debt-list.component';
import { DebtStatisticsComponent } from './debt-statistics/debt-statistics.component';
import { DebtStore } from './debt.store';

@Component({
	selector: 'ex-debts',
	templateUrl: './debts.component.html',
	styleUrl: './debts.component.scss',
	imports: [DebtStatisticsComponent, DebtListComponent, TranslatePipe, ButtonComponent],
})
export class DebtsComponent {
	readonly display = inject(DisplaySizeService);
	private readonly store = inject(DebtStore);
	private readonly dialog = inject(DialogService);
	readonly debtTypes = DebtType;

	readonly isEmpty = computed(() => !this.store.debtResource.isLoading() && this.store.debts().length === 0);

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateDebtDialogComponent, undefined);
		if (!result) return;
		this.store.createDebt(result as DebtCreate);
	}
}
