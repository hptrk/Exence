import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { AbsoluteValuePipe } from '../../../shared/pipes/absolute-value.pipe';
import { SvgIcons } from '../../../shared/svg-icons/svg-icons';

@Component({
	selector: 'ex-summary-container',
	templateUrl: './summary-container.component.html',
	styleUrl: './summary-container.component.scss',
	imports: [MatCardModule, MatIconModule, CurrencyPipe, MatButtonModule, RouterModule, AbsoluteValuePipe],
})
export class SummaryContainerComponent {
	private readonly navigationService = inject(NavigationService);
	private readonly router = inject(Router);

	svgIcon = input<SvgIcons>();
	matIcon = input<string>();
	type = input<TransactionType>();
	value = input.required<number>();
	title = input.required<string>();

	transactionTypes = TransactionType;

	navigate(): void {
		const queryParams: Record<string, string> = {};
		if (this.type()) {
			queryParams['type'] = this.type()!;
		}
		this.router.navigate([this.navigationService.private().transactions()], {
			queryParams,
		});
	}
}
