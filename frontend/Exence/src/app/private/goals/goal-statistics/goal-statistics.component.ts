import { Component, inject } from '@angular/core';
import {
	GOAL_GROUP_WIDGET_TYPES,
	GOAL_WIDGET_TITLES,
} from '../../../data-model/modules/statistics/widget-config.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { StatCardComponent } from '../../statistics/stat-card/stat-card.component';
import { GoalChartComponent } from '../goal-chart/goal-chart.component';
import { GoalStore } from '../goal.store';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';

@Component({
	selector: 'ex-goal-statistics',
	templateUrl: './goal-statistics.component.html',
	styleUrl: './goal-statistics.component.scss',
	imports: [StatCardComponent, GoalChartComponent, AnimatedSkeletonLoaderComponent, TranslatePipe],
})
export class GoalStatisticsComponent {
	readonly store = inject(GoalStore);

	readonly cards = GOAL_GROUP_WIDGET_TYPES.card;
	readonly charts = GOAL_GROUP_WIDGET_TYPES.chart;
	readonly widgetTitles = GOAL_WIDGET_TITLES;
}
