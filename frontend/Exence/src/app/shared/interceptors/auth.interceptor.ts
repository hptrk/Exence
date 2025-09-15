import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
	const token = localStorage.getItem('token'); // JWT token stored in localStorage

	if (token) {
		const cloned = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
		return next(cloned);
	} else {
		return next(req);
	}
}
