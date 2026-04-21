import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { GoalGet } from '../../../data-model/modules/goal/GoalGet';
import { ChartWidget } from '../../../data-model/modules/statistics/ChartWidget';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import {
	GOAL_WIDGET_TITLES,
	GoalWidgetType,
	StatisticsWidgetType,
} from '../../../data-model/modules/statistics/widget-config.model';
import { WidgetDataPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ChartWidgetComponent } from '../../statistics/chart-widget/chart-widget.component';
import { GoalService } from '../goal.service';

@Component({
	selector: 'ex-goal-chart',
	template: `
		@if (syntheticWidget() && payload()) {
			<ex-chart-widget
				[widget]="syntheticWidget()"
				[payload]="payload()"
				noRequest
				[editing]="false"
				(timeframeChanged)="timeframe.set($event)"
				hideTimeframe
				[currency]="selectedGoal()?.currency"
			>
				@if (hasContent()) {
					<mat-form-field subscriptSizing="dynamic" class="p-3">
						<mat-label>{{ 'goals.selectedGoal' | translate }}</mat-label>
						<mat-select [value]="selectedGoal()" (selectionChange)="onGoalSelected($event)">
							@for (goal of goals(); track goal) {
								<mat-option [value]="goal">{{ goal.title }}</mat-option>
							}
						</mat-select>
					</mat-form-field>
				}
			</ex-chart-widget>
		}
	`,
	styles: `
		:host {
			height: 350px;
		}
	`,
	imports: [MatFormFieldModule, MatSelectModule, ChartWidgetComponent, TranslatePipe],
})
export class GoalChartComponent {
	private readonly goalService = inject(GoalService);
	private readonly translocoService = inject(TranslocoService);

	private readonly activeLang = toSignal(this.translocoService.langChanges$, {
		initialValue: this.translocoService.getActiveLang(),
	});

	type = input.required<GoalWidgetType>();
	goals = input.required<GoalGet[]>();

	timeframe = signal<Timeframe>(Timeframe.YEAR_TO_DATE);
	payload = signal<WidgetDataPayload | undefined>(undefined);
	selectedGoal = signal<GoalGet | null>(null);

	hasContent = computed<boolean>(() => this.type() === GoalWidgetType.GOAL_PROGRESS_TREND);

	syntheticWidget = computed<ChartWidget>(() => {
		const lang = this.activeLang();
		return {
			id: 0,
			type: this.type() as unknown as StatisticsWidgetType,
			title: this.translocoService.translate(GOAL_WIDGET_TITLES[this.type()], {}, lang),
			timeframe: this.timeframe(),
			x: 0,
			y: 0,
			cols: 0,
			rows: 0,
		};
	});

	constructor() {
		effect(() => {
			const goals = this.goals();
			if (goals.length > 0 && this.selectedGoal() === null) {
				this.selectedGoal.set(goals[0]);
			}
		});

		effect(() => {
			const type = this.type();
			const goalId = this.selectedGoal()?.id;
			if (type === GoalWidgetType.GOAL_PROGRESS_TREND && !goalId) return;
			this.goalService.getWidgetData(type, this.timeframe(), goalId).then(response => {
				this.payload.set(response.payload);
			});
		});
	}

	onGoalSelected(event: MatSelectChange): void {
		this.selectedGoal.set(event.value);
	}
}
