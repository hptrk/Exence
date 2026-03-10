import { Component, input } from '@angular/core';
import { EmptyStatisticCardComponent } from '../empty-statistic-card.component';

@Component({
	selector: 'ex-stat-card-list',
	templateUrl: './stat-card-list.component.html',
	styleUrl: './stat-card-list.component.scss',
	imports: [EmptyStatisticCardComponent],
})
export class StatCardListComponent {
	numberOfCards = input.required<number>();
}
