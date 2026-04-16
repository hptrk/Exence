import { effect, inject, resource, untracked } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { DebtCreate } from '../../data-model/modules/debt/DebtCreate';
import { DebtGet } from '../../data-model/modules/debt/DebtGet';
import { DebtPatch } from '../../data-model/modules/debt/DebtPatch';
import { DebtPayment } from '../../data-model/modules/debt/DebtPayment';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CurrencyService } from '../../shared/currency.service';
import { DebtService } from './debt.service';
import { WorkspaceGet } from '../../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceService } from '../../shared/workspace.service';
import { AuditLogStore } from '../../shared/audit-log/audit-log.store';

interface DebtStoreData {
	debts: DebtGet[];
}

const initialState: DebtStoreData = {
	debts: [],
};

export const DebtStore = signalStore(
	withState(initialState),

	withProps((_, debtService = inject(DebtService), workspaceService = inject(WorkspaceService)) => {
		return {
			debtResource: resource<DebtGet[], WorkspaceGet | null>({
				params: () => workspaceService.currentWorkspace(),
				loader: async () => await debtService.list(),
			}),
		};
	}),

	withMethods(
		(
			store,
			debtService = inject(DebtService),
			snackbarService = inject(SnackbarService),
			translocoService = inject(TranslocoService),
			auditLogStore = inject(AuditLogStore),
		) => {
			function reload(): void {
				store.debtResource.reload();
			}

			return {
				async createDebt(request: DebtCreate): Promise<void> {
					const result = await debtService.create(request);
					snackbarService.showSuccess(
						translocoService.translate('debts.create.successInfo', { title: result.title }),
					);
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
				},
				async updateDebt(id: number, request: DebtPatch): Promise<void> {
					await debtService.update(id, request);
					snackbarService.showSuccess(translocoService.translate('debts.updateInfo'));
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
				},
				async makePayment(id: number, request: DebtPayment): Promise<void> {
					await debtService.makePayment(id, request);
					snackbarService.showSuccess(translocoService.translate('debts.paymentInfo'));
					reload();
					auditLogStore.resetUser();
					auditLogStore.resetAdmin();
				},
				async deleteDebt(id: number): Promise<void> {
					await debtService.delete(id);
					snackbarService.showSuccess(translocoService.translate('debts.deleteInfo'));
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
				const val = store.debtResource.value();
				if (val && !store.debtResource.isLoading()) {
					patchState(store, _ => ({ debts: [...val] }));
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
