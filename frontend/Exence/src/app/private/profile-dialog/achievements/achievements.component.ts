import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AchievementTier } from '../../../data-model/modules/achievement';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { AchievementStore } from './achievement.store';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
	selector: 'ex-achievements',
	templateUrl: './achievements.component.html',
	styleUrl: './achievements.component.scss',
	imports: [
		NgTemplateOutlet,
		MatTabsModule,
		MatProgressBarModule,
		MatIconModule,
		AnimatedSkeletonLoaderComponent,
		DatePipe,
		TranslatePipe,
	],
})
export class AchievementsComponent {
	protected readonly store = inject(AchievementStore);

	protected selectedIndex = 0;

	protected tierColor(tier: AchievementTier): string {
		const map: Record<AchievementTier, string> = {
			[AchievementTier.BRONZE]: 'var(--achievement-bronze-color)',
			[AchievementTier.SILVER]: 'var(--achievement-silver-color)',
			[AchievementTier.GOLD]: 'var(--achievement-gold-color)',
		};
		return map[tier];
	}
}
