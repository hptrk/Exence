import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
	if (req.url.includes('/api/auth')) {
		return next(req);
	}

	const cookieService = inject(CookieService);
	const token = cookieService.get('access_token');

	if (token) {
		const request = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
		return next(request);
	}

	return next(req);
}
