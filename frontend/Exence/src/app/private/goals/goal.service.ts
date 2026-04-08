import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GoalCreate } from '../../data-model/modules/goal/GoalCreate';
import { GoalGet } from '../../data-model/modules/goal/GoalGet';
import { GoalPatch } from '../../data-model/modules/goal/GoalPatch';
import { GoalStatus } from '../../data-model/modules/goal/GoalStatus';
import { Timeframe } from '../../data-model/modules/statistics/Timeframe';
import { WidgetDataPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { GoalWidgetDataResponse } from '../../data-model/modules/statistics/goal/GoalWidgetDataResponse';
import { GoalWidgetType } from '../../data-model/modules/statistics/widget-config.model';
import { HttpService } from '../../shared/http/http.service';

@Injectable()
export class GoalService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/goals';

	public list(statuses?: GoalStatus[]): Promise<GoalGet[]> {
		return lastValueFrom(this.http.get<GoalGet[]>(this.baseUrl, { statuses: statuses?.join(',') }));
	}

	public getGoal(id: number): Promise<GoalGet> {
		return lastValueFrom(this.http.get<GoalGet>(`${this.baseUrl}/${id}`));
	}

	public create(request: GoalCreate): Promise<GoalGet> {
		return lastValueFrom(this.http.post<GoalGet>(this.baseUrl, request));
	}

	public update(id: number, request: GoalPatch): Promise<GoalGet> {
		return lastValueFrom(this.http.patch<GoalGet>(`${this.baseUrl}/${id}`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}

	public getWidgetData<T extends WidgetDataPayload = WidgetDataPayload>(
		type: GoalWidgetType,
		timeframe?: Timeframe,
		goalId?: number,
	): Promise<GoalWidgetDataResponse<T>> {
		return lastValueFrom(
			this.http.get<GoalWidgetDataResponse<T>>(`${this.baseUrl}/statistics/${type}`, {
				timeframe,
				goalId: goalId?.toString(),
			}),
		);
	}
}
