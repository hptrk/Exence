import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { CookiesService } from '../cookies.service';
import { NavigationService } from './../../navigation/navigation.service';

export function unauthorizedInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const cookie = inject(CookiesService);
	const router = inject(Router);
	const navigationService = inject(NavigationService);
	const authService = inject(AuthService);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status !== 401 && !cookie.isTokenExpired('refresh')) {
				return throwError(() => error);
			}

			if (req.url.includes('/api/auth/refresh-token')) {
				cookie.clearTokens();
				router.navigateByUrl(navigationService.account().login());
				return throwError(() => error);
			}
			return from(authService.refreshToken()).pipe(
				switchMap((tokens) => {
					const request = req.clone({
						setHeaders: {
							Authorization: `Bearer ${tokens.access_token}`,
						},
					});
					return next(request);
				}),
				catchError((refreshError: HttpErrorResponse) => {
					cookie.clearTokens();
					router.navigateByUrl(navigationService.account().login());
					return throwError(() => refreshError);
				})
			);
		})
	);
}

