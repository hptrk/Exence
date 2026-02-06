import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ChangePasswordRequest } from '../../data-model/modules/auth/ChangePasswordRequest';
import { UpdateUserRequest } from '../../data-model/modules/auth/UpdateUserRequest';
import { User } from '../../data-model/modules/auth/User';
import { HttpService } from '../http/http.service';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/user';

	public getUser(): Promise<User> {
		return lastValueFrom(this.http.get<User>(`${this.baseUrl}/me`));
	}

	public updateUser(request: UpdateUserRequest): Promise<User> {
		return lastValueFrom(this.http.put<User>(this.baseUrl, request));
	}

	public changePassword(request: ChangePasswordRequest): Promise<void> {
		return lastValueFrom(this.http.put<void>(`${this.baseUrl}/password`, request));
	}

	public deleteUser(): Promise<void> {
		return lastValueFrom(this.http.delete(this.baseUrl));
	}
}
