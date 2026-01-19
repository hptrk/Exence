import { inject, Injectable } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { HttpService } from '../../shared/http/http.service';
import { getFilters } from '../../shared/util/http-request-utils';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';

@Injectable({
	providedIn: 'root',
})
export class TransactionService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/transactions';

	private transactions?: PagedResponse<Transaction>;
	private transactionsOutOfSync = false;

	private incomes?: PagedResponse<Transaction>;
	private incomesOutOfSync = false;

	private expenses?: PagedResponse<Transaction>;
	private expensesOutOfSync = false;
	
	public get(id: number): Promise<Transaction> {
		return lastValueFrom(this.http.get<Transaction>(`${this.baseUrl}/${id}`));
	}

	public async list(filters?: TransactionFilter, pageIndex?: number): Promise<PagedResponse<Transaction>> {
		if (this.transactions && !this.transactionsOutOfSync && pageIndex === this.transactions.page) {
			return Promise.resolve(this.transactions);
		}
		await lastValueFrom(this.http.get<PagedResponse<Transaction>>(this.baseUrl, { ...getFilters(filters), page: (pageIndex ?? 0).toString() })
			.pipe(tap(transactions => {
				this.transactions = this.getDataToCache(this.transactions, transactions, this.transactionsOutOfSync, pageIndex);
				this.transactionsOutOfSync = false;
			})));
		return this.transactions!;
	}

	public listRecurrings(): Promise<RecurringTransactionsResponse> {
		return lastValueFrom(this.http.get<RecurringTransactionsResponse>(`${this.baseUrl}/recurring`));
	}

	public async listIncomes(pageIndex?: number): Promise<PagedResponse<Transaction>> {
		if (this.incomes && !this.incomesOutOfSync && pageIndex === this.incomes.page) {
			return Promise.resolve(this.incomes);
		}
		await lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/income`, { page: (pageIndex ?? 0).toString() })
			.pipe(tap(incomes => {
				this.incomes = this.getDataToCache(this.incomes, incomes, this.incomesOutOfSync, pageIndex);
				this.incomesOutOfSync = false;
			}))
		);
		return this.incomes!;
	}

	public async listExpenses(pageIndex?: number): Promise<PagedResponse<Transaction>> {
		if (this.expenses && !this.expensesOutOfSync && pageIndex === this.expenses.page) {
			return Promise.resolve(this.expenses);
		}
		await lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/expense`, { page: (pageIndex ?? 0).toString() })
			.pipe(tap(expenses => {
				this.expenses = this.getDataToCache(this.expenses, expenses, this.expensesOutOfSync, pageIndex);
				this.expensesOutOfSync = false;
			}))
		);
		return this.expenses!;
	}

	public totals(): Promise<TransactionTotalsResponse> {
		return lastValueFrom(this.http.get<TransactionTotalsResponse>(`${this.baseUrl}/totals`));
	}

	public create(request: Transaction): Promise<Transaction> {
		return lastValueFrom(this.http.post<Transaction>(this.baseUrl, request).pipe(
			tap(() => {
				if (request.type === TransactionType.INCOME) {
					this.incomesOutOfSync = true;
				} else {
					this.expensesOutOfSync = true;
				}
				this.transactionsOutOfSync = true;
			})
		));
	}

	public update(request: Transaction): Promise<Transaction> {
		return lastValueFrom(this.http.put<Transaction>(`${this.baseUrl}/${request.id}`, request).pipe(
			tap(() => {
				if (request.type === TransactionType.INCOME) {
					this.incomesOutOfSync = true;
				} else {
					this.expensesOutOfSync = true;
				}
				this.transactionsOutOfSync = true;
			})
		));
	}

	// somehow detect what type was removed
	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}

	private getDataToCache(oldCached: PagedResponse<Transaction> | undefined, dataToAddToCache: PagedResponse<Transaction>, isOutOfSync: boolean, pageIndex?: number): PagedResponse<Transaction> {
		// either content, or pageIndex changed
		if (oldCached && (isOutOfSync || pageIndex !== oldCached.page)) {
			const clone: PagedResponse<Transaction> = { ...oldCached };
			const content = [...clone.content.sort((a, b) => b.date.localeCompare(a.date)), ...dataToAddToCache.content];
			const numberOfElements = clone.numberOfElements + dataToAddToCache.numberOfElements;
			
			const result = {
				...dataToAddToCache,
				content,
				numberOfElements
			};
			return result;
		} else {
			return dataToAddToCache;
		}
	}
}
