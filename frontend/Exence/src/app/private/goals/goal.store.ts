import { effect, inject, resource, untracked } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { GoalCreate } from '../../data-model/modules/goal/GoalCreate';
import { GoalGet } from '../../data-model/modules/goal/GoalGet';
import { GoalPatch } from '../../data-model/modules/goal/GoalPatch';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { GoalService } from './goal.service';
import { CurrencyService } from '../../shared/currency.service';
import { WorkspaceGet } from '../../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceService } from '../../shared/workspace.service';
import { AuditLogStore } from '../../shared/audit-log/audit-log.store';
import { AchievementStore } from '../profile-dialog/achievements/achievement.store';

interface GoalStoreData {
	goals: GoalGet[];
}

const initialState: GoalStoreData = {
	goals: [],
};

export const GoalStore = signalStore(
	withState(initialState),

	withProps((_, goalService = inject(GoalService), workspaceService = inject(WorkspaceService)) => {
		return {
			goalResource: resource<GoalGet[], WorkspaceGet | null>({
				params: () => workspaceService.currentWorkspace(),
				loader: async () => await goalService.list(),
			}),
		};
	}),

	withMethods(
		(
			store,
			goalService = inject(GoalService),
			snackbarService = inject(SnackbarService),
			translocoService = inject(TranslocoService),
			auditLogStore = inject(AuditLogStore),
			achievementStore = inject(AchievementStore),
		) => {
			function reload(): void {
				store.goalResource.reload();
			}

			return {
				async createGoal(request: GoalCreate): Promise<void> {
					const result = await goalService.create(request);
					snackbarService.showSuccess(
						translocoService.translate('goals.create.successInfo', { title: result.title }),
					);
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
					achievementStore.reload();
				},
				async updateGoal(id: number, request: GoalPatch): Promise<void> {
					await goalService.update(id, request);
					snackbarService.showSuccess(translocoService.translate('goals.updateInfo'));
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
					achievementStore.reload();
				},
				async deleteGoal(id: number): Promise<void> {
					await goalService.delete(id);
					snackbarService.showSuccess(translocoService.translate('goals.deleteInfo'));
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
				},
				resetState(): void {
					reload();
				},
			};
		},
	),

	withHooks({
		onInit(store, currencyService = inject(CurrencyService)): void {
			effect(() => {
				const val = store.goalResource.value();
				if (val && !store.goalResource.isLoading()) {
					patchState(store, _ => ({ goals: [...val] }));
				}
			});

			const baseCurrency = currencyService.baseCurrency;
			let previousCurrency = untracked(() => baseCurrency());
			effect(() => {
				const current = baseCurrency();

				if (current !== previousCurrency) {
					previousCurrency = current;
					untracked(() => store.resetState());
				}
			});
		},
	}),
);
