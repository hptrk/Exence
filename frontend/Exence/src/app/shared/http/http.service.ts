import {
	HttpClient,
	HttpContext,
	HttpErrorResponse,
	HttpHeaders,
	HttpParams,
	HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ErrorService } from '../error.service';

export interface HttpSettings {
	suppressErrorMessage?: boolean;
}

interface HttpOptions {
	headers?: HttpHeaders | Record<string, string | string[]>;
	context?: HttpContext;
	params?: HttpParams | Record<string, string | string[]>;
}

@Injectable({
	providedIn: 'root',
})
export class HttpService {
	private readonly httpClient = inject(HttpClient);
	private readonly errorService = inject(ErrorService);

	get<T>(url: string, params?: Record<string, string | undefined | null>, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.get<HttpResponse<string>>(url, this.createDefaultRequestOptions(params)),
			settings ?? {},
		);
	}

	post<T>(
		url: string,
		data?: unknown,
		params?: Record<string, string | undefined | null>,
		settings?: HttpSettings,
	): Observable<T> {
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

	delete<T = void>(url: string, data?: unknown, settings?: HttpSettings): Observable<T> {
		return this.call<T>(
			this.httpClient.request<HttpResponse<string>>('DELETE', url, {
				...this.createDefaultRequestOptions(),
				body: data,
			}),
			settings ?? {},
		);
	}

	private call<T>(response: Observable<HttpResponse<string>>, settings: HttpSettings): Observable<T> {
		return response.pipe(
			map(resp => this.parseResponse<T>(resp)!),
			catchError((err: HttpErrorResponse) => {
				this.errorService.handleError(err, settings);
				return throwError(() => err);
			}),
		);
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
		const headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');

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
