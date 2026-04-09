import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { authInterceptor } from '../../../app/shared/auth/interceptors/auth.interceptor';

describe('authInterceptor', () => {
	let http: HttpClient;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
		});

		http = TestBed.inject(HttpClient);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpMock.verify());

	it('adds withCredentials to non-auth requests', () => {
		http.get('/api/items').subscribe();

		const req = httpMock.expectOne('/api/items');
		expect(req.request.withCredentials).toBeTrue();
		req.flush({});
	});

	it('does not add withCredentials to /api/auth requests', () => {
		http.post('/api/auth/login', {}).subscribe();

		const req = httpMock.expectOne('/api/auth/login');
		expect(req.request.withCredentials).toBeFalse();
		req.flush({});
	});
});
