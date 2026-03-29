import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

export function languageInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const translocoService = inject(TranslocoService);

	return next(
		req.clone({
			setHeaders: {
				'Accept-Language': translocoService.getActiveLang(),
			},
		}),
	);
}
