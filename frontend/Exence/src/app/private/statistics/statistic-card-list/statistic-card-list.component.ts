import { Component, input } from '@angular/core';
import { EmptyStatisticCardComponent } from '../empty-statistic-card.component';

@Component({
	selector: 'ex-statistic-card-list',
	templateUrl: './statistic-card-list.component.html',
	styleUrl: './statistic-card-list.component.scss',
	imports: [EmptyStatisticCardComponent],
})
export class StatisticCardListComponent {
	numberOfCards = input.required<number>();
}
