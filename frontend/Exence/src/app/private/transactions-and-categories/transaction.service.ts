import { effect, inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { HttpService } from '../../shared/http/http.service';
import { getFilters } from '../../shared/util/http-request-utils';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CurrentUserService } from '../../shared/user/current-user.service';

@Injectable({
	providedIn: 'root',
})
export class TransactionService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/transactions';

	private transactions?: PagedResponse<Transaction> | null;
	private incomes?: PagedResponse<Transaction> | null;
	private expenses?: PagedResponse<Transaction> | null;
	
	constructor(currentUserService: CurrentUserService) {
		effect(() => {
			currentUserService.user(); // to trigger user change
			this.invalidateCaches();
		});
	}

	public get(id: number): Promise<Transaction> {
		return lastValueFrom(this.http.get<Transaction>(`${this.baseUrl}/${id}`));
	}

	public async list(filters?: TransactionFilter, pageIndex = 0): Promise<PagedResponse<Transaction>> {
		if (this.transactions?.page !== pageIndex) {
			const newPage = await lastValueFrom(this.http.get<PagedResponse<Transaction>>(this.baseUrl, { ...getFilters(filters), page: pageIndex.toString() }));
			this.transactions = this.getDataToCache(this.transactions, newPage, pageIndex);
		}
		return this.transactions!;
	}

	public listRecurrings(): Promise<RecurringTransactionsResponse> {
		return lastValueFrom(this.http.get<RecurringTransactionsResponse>(`${this.baseUrl}/recurring`));
	}

	public async listIncomes(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		if (this.incomes?.page !== pageIndex) {
			const newPage = await lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/income`, { page: pageIndex.toString() }));
			this.incomes = this.getDataToCache(this.incomes, newPage, pageIndex);
		}
		return this.incomes;
	}

	public async listExpenses(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		if (this.expenses?.page !== pageIndex) {
			const newPage = await lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/expense`, { page: (pageIndex ?? 0).toString() }));
			this.expenses = this.getDataToCache(this.expenses, newPage, pageIndex);
		}
		return this.expenses;
	}

	public totals(): Promise<TransactionTotalsResponse> {
		return lastValueFrom(this.http.get<TransactionTotalsResponse>(`${this.baseUrl}/totals`));
	}

	public create(request: Transaction): Promise<Transaction> {
		this.invalidateCachesByType(request.type);
		return lastValueFrom(this.http.post<Transaction>(this.baseUrl, request));
	}

	public update(request: Transaction): Promise<Transaction> {
		this.invalidateCachesByType(request.type);
		return lastValueFrom(this.http.put<Transaction>(`${this.baseUrl}/${request.id}`, request));
	}

	public delete(id: number, type?: TransactionType): Promise<void> {
		this.invalidateCachesByType(type);
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}

	public invalidateCaches(): void {
		this.invalidateTransactionCache();
		this.invalidateIncomeCache();
		this.invalidateExpenseCache();
	}

	public invalidateTransactionCache(): void { this.transactions = null; }
	public invalidateIncomeCache(): void { this.incomes = null; this.transactions = null; }
	public invalidateExpenseCache(): void { this.expenses = null; this.transactions = null; }

	private invalidateCachesByType(type?: TransactionType): void {
		switch (type) {
			case TransactionType.INCOME:
				return this.invalidateIncomeCache();
			case TransactionType.EXPENSE:
				return this.invalidateExpenseCache();
			default:
				return this.invalidateCaches();
		}
	}

	private getDataToCache(oldCached: PagedResponse<Transaction> | null | undefined, dataToAddToCache: PagedResponse<Transaction>, pageIndex?: number): PagedResponse<Transaction> {
		// either content, or pageIndex changed
		if (oldCached && pageIndex !== oldCached.page) {
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
