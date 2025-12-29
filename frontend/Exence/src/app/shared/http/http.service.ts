import { HttpClient, HttpContext, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, OperatorFunction, Subject, tap } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import { HttpSettings } from './http-settings';
import { ErrorResponse } from '../../data-model/modules/ErrorResponse';
interface HttpOptions {
	headers?: HttpHeaders | Record<string, string | string[]>;
	context?: HttpContext;
	params?: HttpParams | Record<string, string | string[]>;
}

export class HttpServiceError extends Error {
	public override cause: HttpErrorResponse;
	override name = 'HttpServiceError';
	constructor(public error: HttpErrorResponse, stackSnapshot?: StackSnapshot) {
		super(error.message);
		this.cause = this.error;
		if (stackSnapshot) this.stack = stackSnapshot.stack ?? '';
	}
}

class StackSnapshot extends Error { }

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private readonly httpClient = inject(HttpClient);
	private readonly snackbarService = inject(SnackbarService);

	private responseEventStream: Subject<HttpResponseBase> = new Subject();

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
		const stackSnapshot = new StackSnapshot();
		return response.pipe(
			this.tapEventStream(),
			catchError((err: HttpErrorResponse) => from(this.handleError(err, settings, stackSnapshot))),
			map(resp => resp ? this.parseResponse<T>(resp)! : null as T),
		);
	}

	private tapEventStream<T extends HttpEvent<unknown>>(): OperatorFunction<T, T> {
		return tap({
			next: resp => { if (resp instanceof HttpResponseBase) this.responseEventStream.next(resp); },
			error: (resp: HttpErrorResponse) => this.responseEventStream.next(resp)
		});
	}

	private async handleError(errorResponse: HttpErrorResponse, settings?: HttpSettings, _stackSnapshot?: StackSnapshot): Promise<void> {
		settings = settings ?? {};

		let error: ErrorResponse | null = null;
		
		try {
			if (errorResponse.error) {
				error = errorResponse.error as ErrorResponse;
				console.log(error);
			}
		} catch (e) {
			console.error('Failed to parse error response:', e);
		}

		switch (error?.status) {
			case 401:
				break;
			default:
				if (!settings.suppressErrorMessage) {
					await this.showErrorFromResponse(error);
				}
				break;
		}
	}

	private async showErrorFromResponse(error: ErrorResponse | null): Promise<void> {
		await new Promise(() => new Date()); // TODO remove
		const errorMessage = error?.detail 
			?? 'Unexpected error occurred';
		
		console.error('Error Response:', error);
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