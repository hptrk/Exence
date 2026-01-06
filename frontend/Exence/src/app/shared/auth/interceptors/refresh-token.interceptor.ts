import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CurrentUserService } from '../../user/current-user.service';

export const SUPPRESS_ERROR_SNACKBAR = new HttpContextToken<boolean>(() => false);

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

				const errorWithContext = { ...error };
				setErrorContext(errorWithContext, req);

				return throwError(() => errorWithContext);
			}

			return from(authService.refreshToken()).pipe(
				tap(() => console.warn('Access token expired. Requesting new access token!')),
				switchMap(() => {
					const request = req.clone({ withCredentials: true });
					return next(request);
				}),
				catchError((refreshError: HttpErrorResponse) => {
					router.navigateByUrl(navigationService.account().login());

					const errorWithContext = { ...refreshError };
					setErrorContext(errorWithContext, req);

					return throwError(() => errorWithContext);
				})
			);
		})
	);
}

function setErrorContext(errorWithContext: HttpErrorResponse, req: HttpRequest<unknown>) {
	Object.defineProperty(errorWithContext, 'context', {
		value: req.context.set(SUPPRESS_ERROR_SNACKBAR, true),
		enumerable: false
	});
}