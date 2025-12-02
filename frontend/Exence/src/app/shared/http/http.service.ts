import { HttpClient, HttpContext, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, finalize, from, map, Observable, OperatorFunction, Subject, tap } from "rxjs";
import { HttpSettings } from "./http-settings";

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
		if (stackSnapshot) this.stack = stackSnapshot.stack;
	}
}

class StackSnapshot extends Error { }

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private readonly httpClient = inject(HttpClient);

	private responseEventStream: Subject<HttpResponseBase> = new Subject();

	get<T>(url: string, params?: Record<string, string | undefined | null>, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.get<HttpResponse<string>>(url, this.createDefaultRequestOptions(params)),
			settings ?? {});

	}

	post<T>(url: string, data?: any, params?: Record<string, string | undefined | null>, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.post<HttpResponse<string>>(url, data, this.createDefaultRequestOptions(params)),
			settings ?? {},
		);
	}

	put<T>(url: string, data: any, settings?: HttpSettings): Observable<T> {
		return this.call(
			this.httpClient.put<HttpResponse<string>>(url, data, this.createDefaultRequestOptions()),
			settings ?? {},
		);
	}

	patch<T>(url: string, data: any, settings?: HttpSettings): Observable<T> {
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
		let stackSnapshot = new StackSnapshot();
		return response.pipe(
			this.tapEventStream(),
			catchError((err: HttpErrorResponse) => from(this.handleError(err, settings, stackSnapshot))),
			map(resp => this.parseResponse<T>(resp)!),
		);
	}

	private tapEventStream<T extends HttpEvent<any>>(): OperatorFunction<T, T> {
		return tap({
			next: resp => { if (resp instanceof HttpResponseBase) this.responseEventStream.next(resp); },
			error: (resp: HttpErrorResponse) => this.responseEventStream.next(resp)
		});
	}

	private async handleError(response: HttpErrorResponse, settings?: HttpSettings, stackSnapshot?: StackSnapshot): Promise<never> {
		settings = settings || {};

		switch (response.status) {
			case 401:
				break;
			default:
				if (!settings.suppressErrorMessage) {
					await this.showErrorFromResponse(response);
				}
				break;
		}

		throw new HttpServiceError(response, stackSnapshot);
	}

	private async showErrorFromResponse(response: HttpErrorResponse): Promise<void> {
		let errorMsg = await this.getErrorMessage(response);
		// TODO snackbar to show error
	}

	protected async getErrorMessage(response: HttpErrorResponse): Promise<string> {
		switch (response.status) {
			case 0:
			case 503:
			case 504:
				console.error('Http response status', response.status, response.error);
				return 'No connection could be established between client and server!';
			case 403:
				return 'You do not have sufficient permissions to perform this operation!';
			case 404:
				return 'The resource cannot be found!';
		}

		try {
			let errorJson = response.error;
			errorJson = await errorJson.text();

			const err = JSON.parse(errorJson);
			return err.message;
		} catch (e) {
			return (response.error || {}).message || response.error;
		}
	}

	private parseResponse<T>(response: HttpResponse<string>): T | null {
		// response.body may be null if the server returns an empty body
		if (response.body === null || response.body === '') {
			return null;
		}

		try {
			return response.body as any as T;
		} catch {
			return response.body as any;
		}
	}

	private createDefaultRequestOptions(params?: Record<string, string | undefined | null>): HttpOptions {
		const headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json');

		let httpParams = params ? this.filterParams(params) : undefined;

		let context = new HttpContext();

		return {
			headers,
			params: httpParams,
			context,
			
		};
	}
	
	private filterParams(params: Record<string, string | undefined | null>): Record<string, string> {
		let filteredParams: Record<string, string> = {};
		for (let key in params) {
			let value = params[key];
			if (value) {
				filteredParams[key] = value;
			}
		}
		return filteredParams;
	}
}