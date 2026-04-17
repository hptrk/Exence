import { computed, inject, resource } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps } from '@ngrx/signals';
import { AchievementGet, UserAchievementGet } from '../../../data-model/modules/achievement';
import { WorkspaceGet } from '../../../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceService } from '../../../shared/workspace.service';
import { AchievementService } from './achievement.service';

export const AchievementStore = signalStore(
	{ providedIn: 'root' },

	withProps((_, service = inject(AchievementService), workspaceService = inject(WorkspaceService)) => ({
		allResource: resource<AchievementGet[], WorkspaceGet | null>({
			params: () => workspaceService.currentWorkspace(),
			loader: () => service.list(),
		}),
		unlockedResource: resource<UserAchievementGet[], WorkspaceGet | null>({
			params: () => workspaceService.currentWorkspace(),
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
