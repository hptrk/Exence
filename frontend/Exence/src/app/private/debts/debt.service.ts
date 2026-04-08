import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DebtCreate } from '../../data-model/modules/debt/DebtCreate';
import { DebtGet } from '../../data-model/modules/debt/DebtGet';
import { DebtPatch } from '../../data-model/modules/debt/DebtPatch';
import { DebtPayment } from '../../data-model/modules/debt/DebtPayment';
import { DebtStatus } from '../../data-model/modules/debt/DebtStatus';
import { DebtType } from '../../data-model/modules/debt/DebtType';
import { WidgetDataPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { DebtWidgetDataResponse } from '../../data-model/modules/statistics/debt/DebtWidgetDataResponse';
import { DebtWidgetType } from '../../data-model/modules/statistics/widget-config.model';
import { HttpService } from '../../shared/http/http.service';

@Injectable()
export class DebtService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/debts';

	public list(statuses?: DebtStatus[], type?: DebtType): Promise<DebtGet[]> {
		return lastValueFrom(
			this.http.get<DebtGet[]>(this.baseUrl, {
				statuses: statuses?.join(','),
				type,
			}),
		);
	}

	public getById(id: number): Promise<DebtGet> {
		return lastValueFrom(this.http.get<DebtGet>(`${this.baseUrl}/${id}`));
	}

	public create(request: DebtCreate): Promise<DebtGet> {
		return lastValueFrom(this.http.post<DebtGet>(this.baseUrl, request));
	}

	public update(id: number, request: DebtPatch): Promise<DebtGet> {
		return lastValueFrom(this.http.patch<DebtGet>(`${this.baseUrl}/${id}`, request));
	}

	public makePayment(id: number, request: DebtPayment): Promise<DebtGet> {
		return lastValueFrom(this.http.patch<DebtGet>(`${this.baseUrl}/${id}/payment`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}

	public getWidgetData<T extends WidgetDataPayload = WidgetDataPayload>(
		type: DebtWidgetType,
	): Promise<DebtWidgetDataResponse<T>> {
		return lastValueFrom(this.http.get<DebtWidgetDataResponse<T>>(`${this.baseUrl}/statistics/${type}`));
	}
}
