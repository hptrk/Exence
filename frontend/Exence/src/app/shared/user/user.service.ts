import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ChangePasswordRequest } from '../../data-model/modules/auth/ChangePasswordRequest';
import { HttpService } from '../http/http.service';
import { UserGet } from '../../data-model/modules/auth/UserGet';
import { UserPatch } from '../../data-model/modules/auth/UserPatch';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/user';

	public getUser(): Promise<UserGet> {
		return lastValueFrom(this.http.get<UserGet>(`${this.baseUrl}/me`));
	}

	public updateUser(request: UserPatch): Promise<UserGet> {
		return lastValueFrom(this.http.patch<UserGet>(this.baseUrl, request));
	}

	public changePassword(request: ChangePasswordRequest): Promise<void> {
		return lastValueFrom(this.http.put<void>(`${this.baseUrl}/password`, request));
	}

	public deleteUser(): Promise<void> {
		return lastValueFrom(this.http.delete(this.baseUrl));
	}
}
