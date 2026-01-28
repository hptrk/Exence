import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { HttpService } from '../../shared/http/http.service';
import { getFilters } from '../../shared/util/http-request-utils';
@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/transactions';

	public get(id: number): Promise<Transaction> {
		return lastValueFrom(this.http.get<Transaction>(`${this.baseUrl}/${id}`));
	}

	public list(filters?: TransactionFilter, pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return lastValueFrom(this.http.get<PagedResponse<Transaction>>(this.baseUrl, { ...getFilters(filters), page: pageIndex.toString() }));
	}

	public listRecurrings(): Promise<RecurringTransactionsResponse> {
		return lastValueFrom(this.http.get<RecurringTransactionsResponse>(`${this.baseUrl}/recurring`));
	}

	public listIncomes(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/income`, { page: pageIndex.toString() }));
	}

	public listExpenses(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/expense`, { page: pageIndex.toString() }));
	}

	public totals(): Promise<TransactionTotalsResponse> {
		return lastValueFrom(this.http.get<TransactionTotalsResponse>(`${this.baseUrl}/totals`));
	}

	public create(request: Transaction): Promise<Transaction> {
		return lastValueFrom(this.http.post<Transaction>(this.baseUrl, request));
	}

	public update(request: Transaction): Promise<Transaction> {
		return lastValueFrom(this.http.put<Transaction>(`${this.baseUrl}/${request.id}`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}
}
