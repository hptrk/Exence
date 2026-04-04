import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { HttpService } from '../../shared/http/http.service';
import { getFilters } from '../../shared/util/utils';
import { TransactionGet } from '../../data-model/modules/transaction/TransactionGet';
import { TransactionCreate } from '../../data-model/modules/transaction/TransactionCreate';
import { TransactionPatch } from '../../data-model/modules/transaction/TransactionPatch';
@Injectable({
	providedIn: 'root',
})
export class TransactionService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/transactions';

	public get(id: number): Promise<TransactionGet> {
		return lastValueFrom(this.http.get<TransactionGet>(`${this.baseUrl}/${id}`));
	}

	public list(filters?: TransactionFilter, pageIndex = 0): Promise<PagedResponse<TransactionGet>> {
		return lastValueFrom(
			this.http.get<PagedResponse<TransactionGet>>(this.baseUrl, {
				...getFilters(filters),
				page: pageIndex.toString(),
			}),
		);
	}

	public listIncomes(pageIndex = 0): Promise<PagedResponse<TransactionGet>> {
		return this.list({ type: TransactionType.INCOME }, pageIndex);
	}

	public listExpenses(pageIndex = 0): Promise<PagedResponse<TransactionGet>> {
		return this.list({ type: TransactionType.EXPENSE }, pageIndex);
	}

	public listRecurrings(pageIndex = 0): Promise<PagedResponse<TransactionGet>> {
		return this.list({ recurring: true }, pageIndex);
	}

	public listRecurringIncomes(pageIndex = 0): Promise<PagedResponse<TransactionGet>> {
		return this.list({ recurring: true, type: TransactionType.INCOME }, pageIndex);
	}

	public listRecurringExpenses(pageIndex = 0): Promise<PagedResponse<TransactionGet>> {
		return this.list({ recurring: true, type: TransactionType.EXPENSE }, pageIndex);
	}

	public totals(): Promise<TransactionTotalsResponse> {
		return lastValueFrom(this.http.get<TransactionTotalsResponse>(`${this.baseUrl}/totals`));
	}

	public create(request: TransactionCreate): Promise<TransactionGet> {
		return lastValueFrom(this.http.post<TransactionGet>(this.baseUrl, request));
	}

	public update(transactionId: number, request: TransactionPatch): Promise<TransactionGet> {
		return lastValueFrom(this.http.patch<TransactionGet>(`${this.baseUrl}/${transactionId}`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}
}
