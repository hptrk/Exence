import { Component, computed, input } from '@angular/core';
import { EmptyStatisticCardComponent } from '../empty-statistic-card.component';
import { StatCardWidget } from '../Widget';
import { StatCardComponent } from '../stat-card/stat-card.component';

@Component({
	selector: 'ex-stat-card-list',
	templateUrl: './stat-card-list.component.html',
	styleUrl: './stat-card-list.component.scss',
	imports: [EmptyStatisticCardComponent],
})
export class StatCardListComponent {
	numberOfCards = input.required<number>();
}
