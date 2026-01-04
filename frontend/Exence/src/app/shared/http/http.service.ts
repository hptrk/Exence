import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import { HttpSettings } from './http-settings';
import { ErrorResponse } from '../../data-model/modules/ErrorResponse';
import { SUPPRESS_ERROR_SNACKBAR } from '../auth/interceptors/refresh-token.interceptor';

interface HttpOptions {
	headers?: HttpHeaders | Record<string, string | string[]>;
	context?: HttpContext;
	params?: HttpParams | Record<string, string | string[]>;
}

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private readonly httpClient = inject(HttpClient);
	private readonly snackbarService = inject(SnackbarService);

	get<T>(url: string, params?: Record<string, string | undefined | null>, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.get<HttpResponse<string>>(url, this.createDefaultRequestOptions(params)),
			settings ?? {});

	}

	post<T>(url: string, data?: unknown, params?: Record<string, string | undefined | null>, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.post<HttpResponse<string>>(url, data, this.createDefaultRequestOptions(params)),
			settings ?? {},
		);
	}

	put<T>(url: string, data: unknown, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.put<HttpResponse<string>>(url, data, this.createDefaultRequestOptions()),
			settings ?? {},
		);
	}

	patch<T>(url: string, data: unknown, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.patch<HttpResponse<string>>(url, data, this.createDefaultRequestOptions()),
			settings ?? {},
		);
	}

	delete(url: string, settings?: HttpSettings): Observable<void> {
		return this.call<void>(
			this.httpClient.delete<HttpResponse<string>>(url, this.createDefaultRequestOptions()),
			settings ?? {},
		);
	}

	private call<T>(response: Observable<HttpResponse<string>>, settings: HttpSettings): Observable<T> {
		return response.pipe(
			catchError((err: HttpErrorResponse) => from(
				this.handleError(err, settings)
			)),
			map(resp => resp ? this.parseResponse<T>(resp)! : null as T),
		);
	}

	private async handleError(errorResponse: HttpErrorResponse, settings?: HttpSettings): Promise<void> {
		settings = settings ?? {};

		const suppressFromInterceptor = (errorResponse as any).context?.get?.(SUPPRESS_ERROR_SNACKBAR) ?? false;

		if (!settings.suppressErrorMessage && !suppressFromInterceptor) {
			const error = this.extractErrorResponse(errorResponse);
			await this.showErrorFromResponse(error, errorResponse);
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

	private async showErrorFromResponse(error: ErrorResponse | null, fallbackError: HttpErrorResponse): Promise<void> {
		const errorMessage = error?.detail 
			?? fallbackError.message
			?? 'Unexpected error occurred';
		
		console.error('Error Response:', error ?? fallbackError);
		this.snackbarService.showError(errorMessage);
	}

	private parseResponse<T>(response: HttpResponse<string> | null): T | null {
		if (!response) {
			return null;
		}
		
		if (typeof response.body !== 'string') {
			return response as T;
		}
		
		try {
			return JSON.parse(response.body) as T;
		} catch {
			return response as T;
		}
	}

	private createDefaultRequestOptions(params?: Record<string, string | undefined | null>): HttpOptions {
		const headers = new HttpHeaders()
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json');

		const httpParams = params ? this.filterParams(params) : undefined;

		const context = new HttpContext();

		return {
			headers,
			params: httpParams,
			context,
		} as HttpOptions;
	}
	
	private filterParams(params: Record<string, string | undefined | null>): Record<string, string> {
		const filteredParams: Record<string, string> = {};
		for (const key in params) {
			const value = params[key];
			if (value) {
				filteredParams[key] = value;
			}
		}
		return filteredParams;
	}
}