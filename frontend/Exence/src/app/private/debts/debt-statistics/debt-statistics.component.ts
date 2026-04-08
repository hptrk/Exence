import { Component } from '@angular/core';
import {
	DEBT_GROUP_WIDGET_TYPES,
	DEBT_WIDGET_TITLES,
} from '../../../data-model/modules/statistics/widget-config.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { StatCardComponent } from '../../statistics/stat-card/stat-card.component';

@Component({
	selector: 'ex-debt-statistics',
	templateUrl: './debt-statistics.component.html',
	styleUrl: './debt-statistics.component.scss',
	imports: [StatCardComponent, TranslatePipe],
})
export class DebtStatisticsComponent {
	readonly cards = DEBT_GROUP_WIDGET_TYPES.card;
	readonly widgetTitles = DEBT_WIDGET_TITLES;
}
