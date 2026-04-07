import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { RecurringTransactionGet } from '../../data-model/modules/transaction/RecurringTransactionGet';
import { lastValueFrom } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionCreate } from '../../data-model/modules/transaction/RecurringTransactionCreate';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { getFilters } from '../../shared/util/utils';
import { RecurringTransactionPatch } from '../../data-model/modules/transaction/RecurringTransactionPatch';

@Injectable()
export class RecurringService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/transactions/recurring';

	public get(id: number): Promise<RecurringTransactionGet> {
		return lastValueFrom(this.http.get<RecurringTransactionGet>(`${this.baseUrl}/${id}`));
	}

	public list(filters?: TransactionFilter, pageIndex = 0): Promise<PagedResponse<RecurringTransactionGet>> {
		return lastValueFrom(
			this.http.get<PagedResponse<RecurringTransactionGet>>(this.baseUrl, {
				...getFilters(filters),
				page: pageIndex.toString(),
			}),
		);
	}

	public listIncomes(pageIndex = 0): Promise<PagedResponse<RecurringTransactionGet>> {
		return this.list({ type: TransactionType.INCOME }, pageIndex);
	}

	public listExpenses(pageIndex = 0): Promise<PagedResponse<RecurringTransactionGet>> {
		return this.list({ type: TransactionType.EXPENSE }, pageIndex);
	}

	public create(request: RecurringTransactionCreate): Promise<RecurringTransactionGet> {
		return lastValueFrom(this.http.post<RecurringTransactionGet>(this.baseUrl, request));
	}

	public update(id: number, request: RecurringTransactionPatch): Promise<RecurringTransactionGet> {
		return lastValueFrom(this.http.patch<RecurringTransactionGet>(`${this.baseUrl}/${id}`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}
}
