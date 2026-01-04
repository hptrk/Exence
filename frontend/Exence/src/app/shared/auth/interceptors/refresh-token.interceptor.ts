import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CurrentUserService } from '../../user/current-user.service';

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const router = inject(Router);
	const navigationService = inject(NavigationService);
	const authService = inject(AuthService);
	const currentUserService = inject(CurrentUserService);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status !== 401 && error.status !== 403) {
				return throwError(() => error);
			}

			if (error.status === 403 && req.url.includes('/api/auth/refresh-token')) {
				currentUserService.clearUser();
				router.navigateByUrl(navigationService.account().login());
				return throwError(() => error);
			}

			return from(authService.refreshToken()).pipe(
				switchMap(() => {
					const request = req.clone({ withCredentials: true });
					return next(request);
				}),
				catchError((refreshError: HttpErrorResponse) => {
					router.navigateByUrl(navigationService.account().login());
					return throwError(() => refreshError);
				})
			);
		})
	);
}

