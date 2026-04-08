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

interface DebtStoreData {
	debts: DebtGet[];
}

const initialState: DebtStoreData = {
	debts: [],
};

export const DebtStore = signalStore(
	withState(initialState),

	withProps((_, debtService = inject(DebtService)) => {
		return {
			debtResource: resource<DebtGet[], undefined>({
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
				},
				async updateDebt(id: number, request: DebtPatch): Promise<void> {
					await debtService.update(id, request);
					snackbarService.showSuccess(translocoService.translate('debts.updateInfo'));
					reload();
				},
				async makePayment(id: number, request: DebtPayment): Promise<void> {
					await debtService.makePayment(id, request);
					snackbarService.showSuccess(translocoService.translate('debts.paymentInfo'));
					reload();
				},
				async deleteDebt(id: number): Promise<void> {
					await debtService.delete(id);
					snackbarService.showSuccess(translocoService.translate('debts.deleteInfo'));
					reload();
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
