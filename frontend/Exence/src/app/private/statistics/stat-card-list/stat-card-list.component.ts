import { Component, computed, input } from '@angular/core';
import { EmptyStatisticCardComponent } from '../empty-statistic-card.component';
import { StatCardWidget } from '../../../data-model/modules/statistics/Widget';
import { StatCardComponent } from '../stat-card/stat-card.component';

@Component({
	selector: 'ex-stat-card-list',
	templateUrl: './stat-card-list.component.html',
	styleUrl: './stat-card-list.component.scss',
	imports: [EmptyStatisticCardComponent, StatCardComponent],
})
export class StatCardListComponent {
	data = input.required<StatCardWidget[]>();

	numberOfCards = computed<number>(() => this.data().length);
}
