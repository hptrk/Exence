import { Component } from '@angular/core';
import {
	INVESTMENT_GROUP_WIDGET_TYPES,
	INVESTMENT_WIDGET_TITLES,
} from '../../../data-model/modules/statistics/widget-config.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { StatCardComponent } from '../../statistics/stat-card/stat-card.component';

@Component({
	selector: 'ex-investment-statistics',
	templateUrl: './investment-statistics.component.html',
	styleUrl: './investment-statistics.component.scss',
	imports: [StatCardComponent, TranslatePipe],
})
export class InvestmentStatisticsComponent {
	readonly cards = INVESTMENT_GROUP_WIDGET_TYPES.card;
	readonly widgetTitles = INVESTMENT_WIDGET_TITLES;
}
