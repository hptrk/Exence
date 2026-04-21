import { Component, computed, inject } from '@angular/core';
import {
	GOAL_GROUP_WIDGET_TYPES,
	GOAL_WIDGET_TITLES,
	GoalWidgetType,
} from '../../../data-model/modules/statistics/widget-config.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { StatCardComponent } from '../../statistics/stat-card/stat-card.component';
import { GoalChartComponent } from '../goal-chart/goal-chart.component';
import { GoalStore } from '../goal.store';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { CategoryStore } from '../../transactions-and-categories/category.store';

@Component({
	selector: 'ex-goal-statistics',
	templateUrl: './goal-statistics.component.html',
	styleUrl: './goal-statistics.component.scss',
	imports: [StatCardComponent, GoalChartComponent, AnimatedSkeletonLoaderComponent, TranslatePipe],
})
export class GoalStatisticsComponent {
	readonly store = inject(GoalStore);
	private readonly categoryStore = inject(CategoryStore);

	readonly cards = GOAL_GROUP_WIDGET_TYPES.card;
	readonly charts = GOAL_GROUP_WIDGET_TYPES.chart;
	readonly widgetTitles = GOAL_WIDGET_TITLES;

	hasCategories = computed(() => (this.categoryStore.categoryResource.value()?.length ?? 0) > 0);

	visibleCharts = computed(() =>
		this.hasCategories() ? this.charts : this.charts.filter(c => c !== GoalWidgetType.GOAL_PROGRESS_TREND),
	);
}
