import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ErrorService } from '../../../app/shared/error.service';
import { HttpService } from '../../../app/shared/http/http.service';

describe('HttpService', () => {
	let service: HttpService;
	let httpMock: HttpTestingController;
	let mockErrorService: jasmine.SpyObj<ErrorService>;

	beforeEach(() => {
		mockErrorService = jasmine.createSpyObj('ErrorService', ['handleError']);

		TestBed.configureTestingModule({
			providers: [
				HttpService,
				{ provide: ErrorService, useValue: mockErrorService },
				provideHttpClient(),
				provideHttpClientTesting(),
			],
		});

		service = TestBed.inject(HttpService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpMock.verify());

	// GET
	describe('get', () => {
		it('makes a GET request to the given URL and returns the response body', done => {
			service.get<{ id: number }>('/api/items').subscribe(result => {
				expect(result).toEqual({ id: 1 });
				done();
			});

			httpMock.expectOne('/api/items').flush({ id: 1 });
		});

		it('sets Accept and Content-Type headers on every GET request', () => {
			service.get('/api/items').subscribe();

			const req = httpMock.expectOne('/api/items');
			expect(req.request.headers.get('Accept')).toBe('application/json');
			expect(req.request.headers.get('Content-Type')).toBe('application/json');
			req.flush({});
		});

		it('appends provided query params to the request URL', () => {
			service.get('/api/items', { page: '2', size: '10' }).subscribe();

			const req = httpMock.expectOne(r => r.url === '/api/items');
			expect(req.request.params.get('page')).toBe('2');
			expect(req.request.params.get('size')).toBe('10');
			req.flush({});
		});

		it('filters out null and undefined values from query params', () => {
			service.get('/api/items', { page: '1', deleted: null, name: undefined }).subscribe();

			const req = httpMock.expectOne(r => r.url === '/api/items');
			expect(req.request.params.get('page')).toBe('1');
			expect(req.request.params.has('deleted')).toBeFalse();
			expect(req.request.params.has('name')).toBeFalse();
			req.flush({});
		});

		it('filters out empty string values from query params', () => {
			service.get('/api/items', { page: '1', empty: '' }).subscribe();

			const req = httpMock.expectOne(r => r.url === '/api/items');
			expect(req.request.params.get('page')).toBe('1');
			expect(req.request.params.has('empty')).toBeFalse();
			req.flush({});
		});

		it('makes a GET request with no params when params object is omitted', () => {
			service.get('/api/items').subscribe();

			const req = httpMock.expectOne('/api/items');
			expect(req.request.method).toBe('GET');
			req.flush({});
		});
	});

	// POST
	describe('post', () => {
		it('makes a POST request with the given body', done => {
			service.post<{ id: number }>('/api/items', { name: 'test' }).subscribe(result => {
				expect(result).toEqual({ id: 42 });
				done();
			});

			const req = httpMock.expectOne('/api/items');
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual({ name: 'test' });
			req.flush({ id: 42 });
		});

		it('appends query params on a POST request', () => {
			service.post('/api/items', {}, { version: '2' }).subscribe();

			const req = httpMock.expectOne(r => r.url === '/api/items');
			expect(req.request.params.get('version')).toBe('2');
			req.flush({});
		});

		it('sends a POST request with no body when data is omitted', () => {
			service.post('/api/items').subscribe();

			const req = httpMock.expectOne('/api/items');
			expect(req.request.method).toBe('POST');
			req.flush({});
		});
	});

	// PUT
	describe('put', () => {
		it('makes a PUT request with the given body', done => {
			service.put<{ id: number }>('/api/items/1', { name: 'updated' }).subscribe(result => {
				expect(result).toEqual({ id: 1 });
				done();
			});

			const req = httpMock.expectOne('/api/items/1');
			expect(req.request.method).toBe('PUT');
			expect(req.request.body).toEqual({ name: 'updated' });
			req.flush({ id: 1 });
		});
	});

	// PATCH
	describe('patch', () => {
		it('makes a PATCH request with the given body', done => {
			service.patch<{ id: number }>('/api/items/1', { name: 'patched' }).subscribe(result => {
				expect(result).toEqual({ id: 1 });
				done();
			});

			const req = httpMock.expectOne('/api/items/1');
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toEqual({ name: 'patched' });
			req.flush({ id: 1 });
		});
	});

	// DELETE
	describe('delete', () => {
		it('makes a DELETE request to the given URL', done => {
			service.delete('/api/items/1').subscribe(() => {
				done();
			});

			const req = httpMock.expectOne('/api/items/1');
			expect(req.request.method).toBe('DELETE');
			req.flush(null);
		});

		it('sends a body with the DELETE request when data is provided', () => {
			service.delete('/api/items/1', { reason: 'cleanup' }).subscribe();

			const req = httpMock.expectOne('/api/items/1');
			expect(req.request.method).toBe('DELETE');
			expect(req.request.body).toEqual({ reason: 'cleanup' });
			req.flush(null);
		});

		it('passes HttpSettings to errorService on a failing DELETE request', done => {
			const settings = { suppressErrorMessage: true };

			service.delete('/api/items/1', undefined, settings).subscribe({
				error: () => {
					expect(mockErrorService.handleError).toHaveBeenCalledOnceWith(
						jasmine.any(Object),
						settings,
					);
					done();
				},
			});

			httpMock.expectOne('/api/items/1').flush('Error', { status: 403, statusText: 'Forbidden' });
		});
	});

	// Error handling
	describe('error handling', () => {
		it('calls errorService.handleError when the request fails', done => {
			service.get('/api/fail').subscribe({
				error: () => {
					expect(mockErrorService.handleError).toHaveBeenCalledOnceWith(
						jasmine.objectContaining({ status: 404 }),
						jasmine.any(Object),
					);
					done();
				},
			});

			httpMock.expectOne('/api/fail').flush('Not found', { status: 404, statusText: 'Not Found' });
		});

		it('rethrows the error so the caller can react', done => {
			service.get('/api/fail').subscribe({
				error: err => {
					expect(err.status).toBe(500);
					done();
				},
			});

			httpMock.expectOne('/api/fail').flush('Server error', { status: 500, statusText: 'Server Error' });
		});

		it('passes the HttpSettings to errorService so it can decide whether to suppress', done => {
			const settings = { suppressErrorMessage: true };

			service.get('/api/fail', undefined, settings).subscribe({
				error: () => {
					expect(mockErrorService.handleError).toHaveBeenCalledOnceWith(jasmine.any(Object), settings);
					done();
				},
			});

			httpMock.expectOne('/api/fail').flush('Error', { status: 400, statusText: 'Bad Request' });
		});

		it('passes default empty settings to errorService when no settings are provided', done => {
			service.get('/api/fail').subscribe({
				error: () => {
					expect(mockErrorService.handleError).toHaveBeenCalledOnceWith(jasmine.any(Object), {});
					done();
				},
			});

			httpMock.expectOne('/api/fail').flush('Error', { status: 400, statusText: 'Bad Request' });
		});
	});
});
