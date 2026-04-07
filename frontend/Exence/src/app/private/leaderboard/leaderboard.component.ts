import { Component, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { AdminWidgetType } from '../../data-model/modules/statistics/widget-config.model';
import { LeaderboardPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SvgIcons } from '../../shared/svg-icons/svg-icons';
import { AdminStatisticsService } from '../admin/admin-statistic.service';
import { mapToProvider } from '../statistics/chart-providers';

export interface PlacementInfo {
	matIcon?: string;
	svgIcon?: SvgIcons;
	label: string;
	value: number;
}

@Component({
	selector: 'ex-leaderboard',
	templateUrl: './leaderboard.component.html',
	styleUrl: './leaderboard.component.scss',
	imports: [MatCardModule, MatIconModule, TranslatePipe],
})
export class LeaderboardComponent {
	private readonly adminStatisticsService = inject(AdminStatisticsService);
	private readonly translocoService = inject(TranslocoService);

	type = input.required<AdminWidgetType>();
	title = input.required<string>();

	placements = signal<PlacementInfo[]>([]);
	isLoading = signal<boolean>(false);

	constructor() {
		effect(() => {
			this.isLoading.set(true);
			this.adminStatisticsService
				.getWidgetData<LeaderboardPayload>(this.type())
				.then(response => {
					const providerFn = mapToProvider<typeof response.payload>('leaderboard');
					this.placements.set(
						providerFn(response.payload, '', this.translocoService.getActiveLang()) as PlacementInfo[],
					);
				})
				.finally(() => this.isLoading.set(false));
		});
	}
}
