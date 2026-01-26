import { inject, Injectable } from '@angular/core';
import { SnackbarService } from './snackbar/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../data-model/modules/ErrorResponse';
import { SUPPRESS_ERROR_SNACKBAR } from './auth/interceptors/refresh-token.interceptor';
import { HttpSettings } from './http/http.service';

@Injectable({
	providedIn: 'root'
})
export class ErrorService {
	private readonly snackbarService = inject(SnackbarService);

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
		const errorMessage = error?.detail 
			?? 'Unexpected error occurred';
		
		console.error('Error Response:', error ?? 'Undexpected error occurred');
		this.snackbarService.showError(errorMessage);
	}
}
