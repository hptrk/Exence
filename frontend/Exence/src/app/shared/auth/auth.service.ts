import { inject, Injectable } from "@angular/core";
import { RegisterRequest } from "../../data-model/modules/auth/RegisterRequest";
import { AuthenticationResponse } from "../../data-model/modules/auth/AuthenticationResponse";
import { lastValueFrom } from "rxjs";
import { HttpService } from "../http/http.service";
import { LoginRequest } from "../../data-model/modules/auth/LoginRequest";
import { EmailVerificationRequest } from "../../data-model/modules/auth/EmailVerificationRequest";
import { ForgotPasswordRequest } from "../../data-model/modules/auth/ForgotPasswordRequest";
import { PasswordResetRequest } from "../../data-model/modules/auth/PasswordResetRequest";
import { CookiesService } from "./cookies.service";

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly http = inject(HttpService);
	private readonly cookie = inject(CookiesService);

	private baseUrl = '/api/auth';

	public register(request: RegisterRequest): Promise<AuthenticationResponse> {
		return lastValueFrom(this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, request));
	}

	public login(request: LoginRequest): Promise<AuthenticationResponse> {
		return lastValueFrom(this.http.post<AuthenticationResponse>(`${this.baseUrl}/login`, request))
			.then(response => {
				this.cookie.saveTokens(response.access_token, response.refresh_token);
				return response;
			});
	}

	public refreshToken(): Promise<AuthenticationResponse> {
		return lastValueFrom(this.http.post<AuthenticationResponse>(`${this.baseUrl}/refresh-token`))
			.then(response => {
				this.cookie.saveTokens(response.access_token, response.refresh_token);
				return response;
			});
	}

	public verifyEmail(request: EmailVerificationRequest): Promise<void> {
		return lastValueFrom(this.http.post<void>(`${this.baseUrl}/verify-email`, request));
	}

	public forgotPassword(request: ForgotPasswordRequest): Promise<void> {
		return lastValueFrom(this.http.post<void>(`${this.baseUrl}/forgot-password`, request));
	}

	public resetPassword(request: PasswordResetRequest): Promise<void> {
		return lastValueFrom(this.http.post<void>(`${this.baseUrl}/reset-password`, request));
	}

	public logout(): Promise<void> {
		return lastValueFrom(this.http.post<void>(`${this.baseUrl}/logout`))
			.finally(() => this.cookie.clearTokens());
	}
}