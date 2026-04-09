import { Component, inject } from '@angular/core';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GoalStatisticsComponent } from './goal-statistics/goal-statistics.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GoalListComponent } from './goal-list/goal-list.component';

@Component({
	selector: 'ex-goals',
	templateUrl: './goals.component.html',
	styleUrl: './goals.component.scss',
	imports: [MatFormFieldModule, GoalStatisticsComponent, GoalListComponent, TranslatePipe],
})
export class GoalsComponent {
	readonly display = inject(DisplaySizeService);
}
