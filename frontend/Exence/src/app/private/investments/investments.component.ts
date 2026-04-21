import { Component, computed, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { InvestmentCreate } from '../../data-model/modules/investment/InvestmentCreate';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import {
	CreateInvestmentDialogComponent,
	CreateInvestmentDialogData,
} from './create-investment-dialog/create-investment-dialog.component';
import { InvestmentListComponent } from './investment-list/investment-list.component';
import { InvestmentStatisticsComponent } from './investment-statistics/investment-statistics.component';
import { InvestmentStore } from './investment.store';

@Component({
	selector: 'ex-investments',
	templateUrl: './investments.component.html',
	styleUrl: './investments.component.scss',
	imports: [InvestmentStatisticsComponent, InvestmentListComponent, ButtonComponent, TranslatePipe],
})
export class InvestmentsComponent {
	private readonly store = inject(InvestmentStore);
	private readonly dialog = inject(DialogService);
	private readonly translocoService = inject(TranslocoService);
	readonly display = inject(DisplaySizeService);

	isEmpty = computed(() => !this.store.investmentResource.isLoading() && this.store.investments().length === 0);

	async openCreate(): Promise<void> {
		const title = this.translocoService.translate('investments.create.newAssetTitle');
		const existingAssets = this.store.investments().map(g => ({ name: g.name, type: g.type }));
		const result = await this.dialog.openNonModal<CreateInvestmentDialogData, InvestmentCreate | null>(
			CreateInvestmentDialogComponent,
			{ title, assetName: null, locked: false, existingAssets },
		);
		if (!result) return;
		this.store.createInvestment(result);
	}
}
