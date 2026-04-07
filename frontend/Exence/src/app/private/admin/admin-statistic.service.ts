import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { AdminWidgetDataResponse } from '../../data-model/modules/statistics/admin/AdminWidgetDataResponse';
import { WidgetDataPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { Timeframe } from '../../data-model/modules/statistics/Timeframe';
import { lastValueFrom } from 'rxjs';
import { AdminWidgetType } from '../../data-model/modules/statistics/widget-config.model';

@Injectable()
export class AdminStatisticsService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/admin/statistics';

	public getWidgetData<T extends WidgetDataPayload = WidgetDataPayload>(
		type: AdminWidgetType,
		timeframe?: Timeframe,
	): Promise<AdminWidgetDataResponse<T>> {
		return lastValueFrom(this.http.get<AdminWidgetDataResponse<T>>(`${this.baseUrl}/${type}`, { timeframe }));
	}
}
