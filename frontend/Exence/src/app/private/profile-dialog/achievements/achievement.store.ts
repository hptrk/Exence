import { computed, inject, resource } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps } from '@ngrx/signals';
import { AchievementGet, UserAchievementGet } from '../../../data-model/modules/achievement';
import { AchievementService } from './achievement.service';

export const AchievementStore = signalStore(
	{ providedIn: 'root' },

	withProps((_, service = inject(AchievementService)) => ({
		allResource: resource<AchievementGet[], void>({
			loader: () => service.list(),
		}),
		unlockedResource: resource<UserAchievementGet[], void>({
			loader: () => service.listUnlocked(),
		}),
	})),

	withMethods(store => ({
		reload(): void {
			store.allResource.reload();
			store.unlockedResource.reload();
		},
	})),

	withComputed(store => ({
		achievements: computed(() => store.allResource.value() ?? []),
		unlockedAchievements: computed(() => store.unlockedResource.value() ?? []),
		isLoading: computed(() => store.allResource.isLoading() || store.unlockedResource.isLoading()),
	})),
);
