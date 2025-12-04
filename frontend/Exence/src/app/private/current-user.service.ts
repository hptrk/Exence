import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { User } from "../data-model/modules/auth/User";
import { CookiesService } from "../shared/auth/cookies.service";
import { jwtDecode } from "jwt-decode";
import { HttpService } from "../shared/http/http.service";
import { lastValueFrom } from "rxjs";
import { AuthService } from "../shared/auth/auth.service";

@Injectable({
	providedIn: 'root'
})
export class CurrentUserService {
	private readonly cookies = inject(CookiesService);
	private readonly http = inject(HttpService);
	private readonly authService = inject(AuthService);

	private _user: WritableSignal<User | null> = signal(null);

	get user(): Signal<User> { return this._user.asReadonly() as Signal<User>; }
	
	async getIsLoggedIn(): Promise<boolean> {
		if (this.cookies.hasAccessToken() && jwtDecode(this.cookies.getAccessToken()!, { header: false })) {
			const user = await this.getUser();
			this.setUser(user);
			return true;
		}
		
		if (this.cookies.hasRefreshToken()) {
			const resp = await this.authService.refreshToken();
			const user = await this.getUser();
			this.setUser(user);
			this.cookies.saveTokens(resp.access_token, resp.refresh_token);
			return true;
		}
		return false;
	}

	setUser(user: User | null): void {
		if (!user) return;
		
		this._user.set(user);
	}
	
	clearUser(): void {
		this._user.set(null);
		this.cookies.clearTokens();
	}

	getUser(): Promise<User> {
		return lastValueFrom(this.http.get<User>('/api/user/me'));
	}
}