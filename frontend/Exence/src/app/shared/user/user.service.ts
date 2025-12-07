import { inject, Injectable } from "@angular/core";
import { HttpService } from "../http/http.service";
import { User } from "../../data-model/modules/auth/User";
import { lastValueFrom } from "rxjs";
import { UpdateUserRequest } from "../../data-model/modules/auth/UpdateUserRequest";
import { ChangePasswordRequest } from "../../data-model/modules/auth/ChangePasswordRequest";

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/user'

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