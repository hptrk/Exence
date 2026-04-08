import { Component, inject } from '@angular/core';
import { DebtType } from '../../data-model/modules/debt/DebtType';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DebtListComponent } from './debt-list/debt-list.component';
import { DebtStatisticsComponent } from './debt-statistics/debt-statistics.component';

@Component({
	selector: 'ex-debts',
	templateUrl: './debts.component.html',
	styleUrl: './debts.component.scss',
	imports: [DebtStatisticsComponent, DebtListComponent, TranslatePipe],
})
export class DebtsComponent {
	readonly display = inject(DisplaySizeService);
	readonly debtTypes = DebtType;
}
