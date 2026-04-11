import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { SystemSettingsResponse } from '../../data-model/modules/admin/SystemSettingsResponse';
import { SystemSettingsPatchRequest } from '../../data-model/modules/admin/SystemSettingsPatchRequest';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AdminSettingsService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/admin/settings';

	public getSettings(): Promise<SystemSettingsResponse> {
		return lastValueFrom(this.http.get<SystemSettingsResponse>(this.baseUrl));
	}

	public updateSettings(request: SystemSettingsPatchRequest): Promise<SystemSettingsResponse> {
		return lastValueFrom(this.http.patch<SystemSettingsResponse>(this.baseUrl, request));
	}
}
