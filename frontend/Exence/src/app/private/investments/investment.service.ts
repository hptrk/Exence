import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { InvestmentCreate } from '../../data-model/modules/investment/InvestmentCreate';
import { InvestmentGet } from '../../data-model/modules/investment/InvestmentGet';
import { InvestmentGroup } from '../../data-model/modules/investment/InvestmentGroup';
import { InvestmentPatch } from '../../data-model/modules/investment/InvestmentPatch';
import { InvestmentWidgetDataResponse } from '../../data-model/modules/statistics/investment/InvestmentWidgetDataResponse';
import { WidgetDataPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { InvestmentWidgetType } from '../../data-model/modules/statistics/widget-config.model';
import { HttpService } from '../../shared/http/http.service';

@Injectable()
export class InvestmentService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/investments';

	public getGroupedInvestments(): Promise<InvestmentGroup[]> {
		return lastValueFrom(this.http.get<InvestmentGroup[]>(`${this.baseUrl}/grouped`));
	}

	public create(request: InvestmentCreate): Promise<InvestmentGet> {
		return lastValueFrom(this.http.post<InvestmentGet>(this.baseUrl, request));
	}

	public update(id: number, request: InvestmentPatch): Promise<InvestmentGet> {
		return lastValueFrom(this.http.patch<InvestmentGet>(`${this.baseUrl}/${id}`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}

	public getWidgetData<T extends WidgetDataPayload = WidgetDataPayload>(
		type: InvestmentWidgetType,
	): Promise<InvestmentWidgetDataResponse<T>> {
		return lastValueFrom(this.http.get<InvestmentWidgetDataResponse<T>>(`${this.baseUrl}/statistics/${type}`));
	}
}
