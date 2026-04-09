import { Component, inject } from '@angular/core';
import { DisplaySizeService } from '../../shared/display-size.service';
import { InvestmentListComponent } from './investment-list/investment-list.component';
import { InvestmentStatisticsComponent } from './investment-statistics/investment-statistics.component';

@Component({
	selector: 'ex-investments',
	templateUrl: './investments.component.html',
	styleUrl: './investments.component.scss',
	imports: [InvestmentStatisticsComponent, InvestmentListComponent],
})
export class InvestmentsComponent {
	readonly display = inject(DisplaySizeService);
}
