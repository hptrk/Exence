import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SvgIcons } from '../../../shared/svg-icons/svg-icons';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { Router, RouterModule } from '@angular/router';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';

@Component({
	selector: 'ex-summary-container',
	templateUrl: './summary-container.component.html',
	styleUrl: './summary-container.component.scss',
	imports: [
		MatCardModule,
		MatIconModule,
		CurrencyPipe,
		MatButtonModule,
		RouterModule
	],
})
export class SummaryContainerComponent {
	private readonly navigation = inject(NavigationService);
	private readonly router = inject(Router);

	svgIcon = input<SvgIcons>();
	matIcon = input<string>();
	type = input<TransactionType>();
	value = input.required<number>();
	title = input.required<string>();

	transactionTypes = TransactionType;

	// TODO navigate with filter on click
	navigate(): void {
		const queryParams: { [key: string]: string } = {};
		// switch (this.data().type) {
		// 	case SummaryType.INCOME:
		// 		queryParams['amountFilter'] = 'gt';
		// 		queryParams['amountValue'] = '0';
		// 		break;
		// 	case SummaryType.EXPENSE:
		// 		queryParams['amountFilter'] = 'lt';
		// 		queryParams['amountValue'] = '0';
		// 		break;
		// 	case SummaryType.OTHER:
		// 		if (this.filterCondition()) {
		// 			Object.entries(this.filterCondition()!).forEach(([key, value]) => {
		// 				queryParams[key] = value;
		// 			});
		// 		}
		// 		break;
		// }
		this.router.navigate([this.navigation.private().transactions()], { queryParams });
	}
}
