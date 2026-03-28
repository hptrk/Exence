import { inject, Injectable } from '@angular/core';
import { SnackbarService } from './snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../data-model/modules/ErrorResponse';
import { SUPPRESS_ERROR_SNACKBAR } from './auth/interceptors/refresh-token.interceptor';
import { HttpSettings } from './http/http.service';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
	providedIn: 'root',
})
export class ErrorService {
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);

	handleError(errorResponse: HttpErrorResponse, settings?: HttpSettings): void {
		settings = settings ?? {};

		// eslint-disable-next-line
		const suppressFromInterceptor = (errorResponse as any).context?.get?.(SUPPRESS_ERROR_SNACKBAR) ?? false;

		if (!settings.suppressErrorMessage && !suppressFromInterceptor) {
			const error = this.extractErrorResponse(errorResponse);
			this.showErrorFromResponse(error);
		}
	}

	private extractErrorResponse(httpError: HttpErrorResponse): ErrorResponse | null {
		try {
			if (httpError.error && typeof httpError.error === 'object') {
				return httpError.error as ErrorResponse;
			}
		} catch (e) {
			console.error('Failed to parse error response:', e);
		}
		return null;
	}

	private showErrorFromResponse(error: ErrorResponse | null): void {
		const errorMessage = error?.detail ?? this.translocoService.translate('errors.unexpected')!;

		console.error('Error Response:', error ?? 'Unexpected error occurred!');
		this.snackbarService.showError(errorMessage);
	}
}
