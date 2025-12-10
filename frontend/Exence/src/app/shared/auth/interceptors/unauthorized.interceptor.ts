import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { CookiesService } from '../cookies.service';

export function unauthorizedInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
	const cookie = inject(CookiesService);
	const router = inject(Router);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status !== 401) {
				return throwError(() => error);
			}

			if (req.url.includes('/api/auth/refresh-token')) {
				cookie.clearTokens();
				router.navigate(['/login']);
				return throwError(() => error);
			}

			const token = cookie.hasRefreshToken() && cookie.getRefreshToken();
			return of(token!).pipe(
				switchMap(() => {
					return next(req);
				}),
				catchError((refreshError) => {
					cookie.clearTokens();
					router.navigate(['/login']);
					return throwError(() => refreshError);
				})
			);
		})
	);
}

