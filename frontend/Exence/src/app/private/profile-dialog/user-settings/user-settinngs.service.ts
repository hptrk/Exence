import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UserSettingsResponse } from '../../../data-model/modules/user-settings/UserSettingsResponse';
import { HttpService } from '../../../shared/http/http.service';
import { UpdateUserSettingsRequest } from '../../../data-model/modules/user-settings/UpdateUserSettingsRequest';

@Injectable()
export class UserSettingsService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/user/settings';

	public list(): Promise<UserSettingsResponse> {
		return lastValueFrom(this.http.get<UserSettingsResponse>(this.baseUrl));
	}

	public update(request: UpdateUserSettingsRequest): Promise<UserSettingsResponse> {
		return lastValueFrom(this.http.patch<UserSettingsResponse>(this.baseUrl, request));
	}
}
