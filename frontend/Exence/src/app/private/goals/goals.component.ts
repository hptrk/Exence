import { Component, computed, inject } from '@angular/core';
import { GoalCreate } from '../../data-model/modules/goal/GoalCreate';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CreateGoalDialogComponent } from './create-goal-dialog/create-goal-dialog.component';
import { GoalStatisticsComponent } from './goal-statistics/goal-statistics.component';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalStore } from './goal.store';

@Component({
	selector: 'ex-goals',
	templateUrl: './goals.component.html',
	styleUrl: './goals.component.scss',
	imports: [GoalStatisticsComponent, GoalListComponent, ButtonComponent, TranslatePipe],
})
export class GoalsComponent {
	private readonly store = inject(GoalStore);
	private readonly dialog = inject(DialogService);
	readonly display = inject(DisplaySizeService);

	isEmpty = computed(() => !this.store.goalResource.isLoading() && this.store.goals().length === 0);

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateGoalDialogComponent, undefined);
		if (!result) return;
		this.store.createGoal(result as GoalCreate);
	}
}
