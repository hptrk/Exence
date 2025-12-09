import { inject, Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { CookieService } from "ngx-cookie-service";

@Injectable({
	providedIn: 'root'
})
export class CookiesService {
	private readonly cookieService = inject(CookieService);


	public hasAccessToken(): boolean {
		return this.cookieService.check('access_token');
	}

	public hasRefreshToken(): boolean {
		return this.cookieService.check('refresh_token');
	}

	public getAccessToken(): string | null {
		return this.cookieService.get('access_token') || null;
	}

	public getRefreshToken(): string | null {
		return this.cookieService.get('refresh_token') || null;
	}

	public clearTokens(): void {
		this.cookieService.delete('access_token', '/');
		this.cookieService.delete('refresh_token', '/');
	}

	public saveTokens(accessToken: string, refreshToken: string): void {
		// TODO get from backend config - config.service
		// 30 min
		const accessTokenExpires = new Date();
		accessTokenExpires.setSeconds(accessTokenExpires.getSeconds() + 1800);
		
		// TODO get from backend config - config.service
		// 14 nap
		const refreshTokenExpires = new Date();
		refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 14);

		this.cookieService.set('access_token', accessToken, {
			expires: accessTokenExpires,
			path: '/',
			sameSite: 'Strict',
			secure: false // TEST: dev value, make it true for prod
		});

		this.cookieService.set('refresh_token', refreshToken, {
			expires: refreshTokenExpires,
			path: '/',
			sameSite: 'Strict',
			secure: false // TEST: dev value, make it true for prod
		});
	}

	public isTokenExpired(token: string): boolean {
		try {
            const decoded = jwtDecode<{ exp: number }>(token);
            if (!decoded.exp) {
                return true;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
	}
		
}