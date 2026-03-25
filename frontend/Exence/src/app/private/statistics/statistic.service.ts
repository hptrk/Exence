import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Timeframe } from '../../data-model/modules/statistics/Timeframe';
import { UpdateLayoutRequest } from '../../data-model/modules/statistics/UpdateLayoutRequest';
import { Widget } from '../../data-model/modules/statistics/Widget';
import { WidgetDataPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { WidgetDataResponse } from '../../data-model/modules/statistics/WidgetDataReponse';
import { WidgetLayoutResponse } from '../../data-model/modules/statistics/WidgetLayoutResponse';
import { HttpService } from '../../shared/http/http.service';

@Injectable()
export class StatisticService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/statistics/widgets';

	public getDashboardChart(timeframe?: Timeframe): Promise<WidgetDataResponse> {
		return lastValueFrom(this.http.get<WidgetDataResponse>(`${this.baseUrl}/dashboard`, { timeframe }));
	}

	public getLayout(): Promise<WidgetLayoutResponse> {
		return lastValueFrom(this.http.get<WidgetLayoutResponse>(`${this.baseUrl}/layout`));
	}

	public getWidgetData<T extends WidgetDataPayload = WidgetDataPayload>(
		widgetId: number,
		timeframe?: Timeframe,
	): Promise<WidgetDataResponse<T>> {
		return lastValueFrom(this.http.get<WidgetDataResponse<T>>(`${this.baseUrl}/${widgetId}/data`, { timeframe }));
	}

	public createWidget(request: Widget): Promise<WidgetLayoutResponse> {
		return lastValueFrom(this.http.post<WidgetLayoutResponse>(this.baseUrl, request));
	}

	public updateLayout(request: UpdateLayoutRequest): Promise<WidgetLayoutResponse> {
		return lastValueFrom(this.http.put<WidgetLayoutResponse>(`${this.baseUrl}/layout`, request));
	}
}
