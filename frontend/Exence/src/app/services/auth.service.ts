import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
	access_token: string;
}

interface UserData {
	id: number;
	email: string;
	username: string;
}

interface RegisterData {
	email: string;
	password: string;
	username: string;
}

interface LoginData {
	email: string;
	password: string;
}
@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly http = inject(HttpClient);
	private readonly router = inject(Router);
	private readonly baseUrl = 'http://localhost:8080';
	private readonly authUrl = `${this.baseUrl}/auth`;

	private readonly userData = signal<UserData | null>(null);
	private readonly isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

	getUserData() {
		return this.userData;
	}
	getIsAuthenticated() {
		return this.isAuthenticated;
	}

	register(data: RegisterData) {
		return this.http.post<AuthResponse>(`${this.authUrl}/register`, data).pipe(
			tap(response => {
				this.handleAuthResponse(response);
			}),
		);
	}

	login(data: LoginData) {
		return this.http.post<AuthResponse>(`${this.authUrl}/authenticate`, data).pipe(
			tap(response => {
				this.handleAuthResponse(response);
			}),
		);
	}

	logout(): void {
		localStorage.removeItem('token');
		this.userData.set(null);
		this.isAuthenticated.set(false);
		this.router.navigate(['/login']);
	}

	fetchUserData() {
		return this.http.get<UserData>(`${this.baseUrl}/users/me`).pipe(
			tap(userData => {
				this.userData.set(userData);
			}),
		);
	}

	private handleAuthResponse(response: AuthResponse): void {
		localStorage.setItem('token', response.access_token);
		this.isAuthenticated.set(true);
		this.fetchUserData().subscribe();
	}
}
