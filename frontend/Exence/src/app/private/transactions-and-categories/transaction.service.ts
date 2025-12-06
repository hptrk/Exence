import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { last, lastValueFrom } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';

@Injectable({
	providedIn: 'root',
})
export class TransactionService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/transactions';
	
	public get(id: number): Promise<Transaction> {
		return lastValueFrom(this.http.get<Transaction>(`${this.baseUrl}/${id}`));
	}

	public list(): Promise<PagedResponse<Transaction>> {
		return lastValueFrom(this.http.get<PagedResponse<Transaction>>(this.baseUrl));
	}

	public listRecurrings(): Promise<PagedResponse<RecurringTransactionsResponse>> {
		return lastValueFrom(this.http.get<PagedResponse<RecurringTransactionsResponse>>(`${this.baseUrl}/recurring`));
	}

	public incomes(): Promise<PagedResponse<Transaction>> {
		return lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/income`));
	}

	public expenses(): Promise<PagedResponse<Transaction>> {
		return lastValueFrom(this.http.get<PagedResponse<Transaction>>(`${this.baseUrl}/expense`));
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
