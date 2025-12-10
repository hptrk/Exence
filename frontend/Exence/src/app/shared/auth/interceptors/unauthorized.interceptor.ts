import { NavigationService } from './../../navigation/navigation.service';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { CookiesService } from '../cookies.service';
import { SnackbarService } from '../../snackbar/snackbar.service';
import { ErrorResponse } from '../../../data-model/modules/ErrorResponse';

export function unauthorizedInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
	const cookie = inject(CookiesService);
	const router = inject(Router);
	const navigationService = inject(NavigationService);
	const snackbarService = inject(SnackbarService);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status !== 401) {
				return throwError(() => error);
			}

			if (req.url.includes('/api/auth/refresh-token')) {
				cookie.clearTokens();
				router.navigateByUrl(navigationService.account().login());
				return throwError(() => error);
			}

			const token = cookie.hasRefreshToken() && cookie.getRefreshToken();
			return of(token!).pipe(
				switchMap(() => {
					return next(req);
				}),
				catchError((refreshError: HttpErrorResponse) => {
					cookie.clearTokens();
					router.navigateByUrl(navigationService.account().login());
					console.log(refreshError)
					snackbarService.showError(refreshError.error.detail);
					return throwError(() => refreshError);
				})
			);
		})
	);
}

