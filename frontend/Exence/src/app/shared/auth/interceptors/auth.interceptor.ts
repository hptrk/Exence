import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	if (req.url.includes('/api/auth')) {
		return next(req);
	}

	const request = req.clone({
		withCredentials: true,
	});

	return next(request);
}
