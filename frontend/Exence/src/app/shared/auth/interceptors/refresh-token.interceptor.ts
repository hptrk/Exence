import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	if (!req.url.includes('/api/auth/refresh-token')) {
		return next(req);
	}

	const cookieService = inject(CookieService);
	const refreshToken = cookieService.get('refresh_token');

	if (refreshToken) {
		const request = req.clone({
			setHeaders: {
				Authorization: `Bearer ${refreshToken}`,
			},
		});
		return next(request);
	}

	return next(req);
}
