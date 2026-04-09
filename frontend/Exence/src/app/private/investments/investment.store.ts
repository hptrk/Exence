import { effect, inject, resource, untracked } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { InvestmentCreate } from '../../data-model/modules/investment/InvestmentCreate';
import { InvestmentGroup } from '../../data-model/modules/investment/InvestmentGroup';
import { InvestmentPatch } from '../../data-model/modules/investment/InvestmentPatch';
import { CurrencyService } from '../../shared/currency.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { InvestmentService } from './investment.service';

interface InvestmentStoreData {
	investments: InvestmentGroup[];
}

const initialState: InvestmentStoreData = {
	investments: [],
};

export const InvestmentStore = signalStore(
	withState(initialState),

	withProps((_, investmentService = inject(InvestmentService)) => {
		return {
			investmentResource: resource<InvestmentGroup[], undefined>({
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
				},
				async updateInvestment(id: number, request: InvestmentPatch): Promise<void> {
					await investmentService.update(id, request);
					snackbarService.showSuccess(translocoService.translate('investments.updateInfo'));
					reload();
				},
				async deleteInvestment(id: number): Promise<void> {
					await investmentService.delete(id);
					snackbarService.showSuccess(translocoService.translate('investments.deleteInfo'));
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
