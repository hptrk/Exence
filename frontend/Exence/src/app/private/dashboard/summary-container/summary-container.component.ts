import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SvgIcons } from '../../../shared/svg-icons/svg-icons';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { Router, RouterModule } from '@angular/router';

export enum SummaryType {
	EXPENSE = 'EXPENSE', 
	INCOME = 'INCOME',
	BALANCE = 'BALANCE', 
	OTHER = 'OTHER' 
}

export type SummaryInfo = {
	svgIcon?: SvgIcons;
	matIcon?: string;
	value: number;
	title: string;
	type: SummaryType;
	filterCondition?: { [key: string]: string }; // for type OTHER
}

@Component({
	selector: 'ex-summary-container',
	imports: [MatCardModule, MatIconModule, CurrencyPipe, MatButtonModule, RouterModule],
	templateUrl: './summary-container.component.html',
	styleUrl: './summary-container.component.scss',
})
export class SummaryContainerComponent {
	private readonly navigation = inject(NavigationService);
	private readonly router = inject(Router);

	data = input.required<SummaryInfo>();

	navigate(): void {
		const queryParams: { [key: string]: string } = {};
		switch (this.data().type) {
			case SummaryType.INCOME:
				queryParams['amountFilter'] = 'gt';
				queryParams['amountValue'] = '0';
				break;
			case SummaryType.EXPENSE:
				queryParams['amountFilter'] = 'lt';
				queryParams['amountValue'] = '0';
				break;
			case SummaryType.OTHER:
				if (this.data().filterCondition) {
					Object.entries(this.data().filterCondition!).forEach(([key, value]) => {
						queryParams[key] = value;
					});
				}
				break;
		}
		this.router.navigate([this.navigation.private().transactions()], { queryParams });
	}
}
