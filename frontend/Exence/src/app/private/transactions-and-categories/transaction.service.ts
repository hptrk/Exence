import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
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

	public listIncomes(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return this.list({ type: TransactionType.INCOME }, pageIndex);
	}

	public listExpenses(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return this.list({ type: TransactionType.EXPENSE }, pageIndex);
	}

	public listRecurrings(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return this.list({ recurring: true }, pageIndex);
	}

	public listRecurringIncomes(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return this.list({ recurring: true, type: TransactionType.INCOME }, pageIndex);
	}

	public listRecurringExpenses(pageIndex = 0): Promise<PagedResponse<Transaction>> {
		return this.list({ recurring: true, type: TransactionType.EXPENSE }, pageIndex);
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
