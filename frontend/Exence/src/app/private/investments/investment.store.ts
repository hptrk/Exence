import { effect, inject, resource, untracked } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { InvestmentCreate } from '../../data-model/modules/investment/InvestmentCreate';
import { InvestmentGroup } from '../../data-model/modules/investment/InvestmentGroup';
import { InvestmentPatch } from '../../data-model/modules/investment/InvestmentPatch';
import { CurrencyService } from '../../shared/currency.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { InvestmentService } from './investment.service';
import { WorkspaceGet } from '../../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceService } from '../../shared/workspace.service';
import { AuditLogStore } from '../../shared/audit-log/audit-log.store';

interface InvestmentStoreData {
	investments: InvestmentGroup[];
}

const initialState: InvestmentStoreData = {
	investments: [],
};

export const InvestmentStore = signalStore(
	withState(initialState),

	withProps((_, investmentService = inject(InvestmentService), workspaceService = inject(WorkspaceService)) => {
		return {
			investmentResource: resource<InvestmentGroup[], WorkspaceGet | null>({
				params: () => workspaceService.currentWorkspace(),
				loader: async () => await investmentService.getGroupedInvestments(),
			}),
		};
	}),

	withMethods(
		(
			store,
			investmentService = inject(InvestmentService),
			snackbarService = inject(SnackbarService),
			translocoService = inject(TranslocoService),
			auditLogStore = inject(AuditLogStore),
		) => {
			function reload(): void {
				store.investmentResource.reload();
			}

			return {
				async createInvestment(request: InvestmentCreate): Promise<void> {
					const result = await investmentService.create(request);
					snackbarService.showSuccess(
						translocoService.translate('investments.create.successInfo', { asset: result.asset }),
					);
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
				},
				async updateInvestment(id: number, request: InvestmentPatch): Promise<void> {
					await investmentService.update(id, request);
					snackbarService.showSuccess(translocoService.translate('investments.updateInfo'));
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
				},
				async deleteInvestment(id: number): Promise<void> {
					await investmentService.delete(id);
					snackbarService.showSuccess(translocoService.translate('investments.deleteInfo'));
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
				const val = store.investmentResource.value();
				if (val && !store.investmentResource.isLoading()) {
					patchState(store, _ => ({ investments: [...val] }));
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
