import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { last, lastValueFrom } from 'rxjs';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';

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
