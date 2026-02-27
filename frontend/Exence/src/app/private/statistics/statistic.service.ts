import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../shared/http/http.service';
import { Timeframe } from './Timeframe';
import { Widget, WidgetDataResponse } from './widget-config.model';
import { WidgetLayoutResponse } from './WidgetLayoutResponse';
import { UpdateLayoutRequest } from './UpdateLayoutRequest';
import { WidgetDataPayload } from './WidgetDataPayload';

@Injectable()
export class StatisticService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/statistics/widgets';

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
		return lastValueFrom(this.http.post<WidgetLayoutResponse>(`${this.baseUrl}/layout`, request));
	}
}
