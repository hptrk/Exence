import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { languageInterceptor } from '../../../app/shared/auth/interceptors/language.interceptor';

describe('languageInterceptor', () => {
	let http: HttpClient;
	let httpMock: HttpTestingController;
	let mockTransloco: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		mockTransloco = jasmine.createSpyObj('TranslocoService', ['getActiveLang']);
		mockTransloco.getActiveLang.and.returnValue('en');

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([languageInterceptor])),
				provideHttpClientTesting(),
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		});

		http = TestBed.inject(HttpClient);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpMock.verify());

	it('adds Accept-Language header with the active language', () => {
		http.get('/api/items').subscribe();

		const req = httpMock.expectOne('/api/items');
		expect(req.request.headers.get('Accept-Language')).toBe('en');
		req.flush({});
	});

	it('uses the current active language for each request', () => {
		mockTransloco.getActiveLang.and.returnValue('hu');

		http.get('/api/items').subscribe();

		const req = httpMock.expectOne('/api/items');
		expect(req.request.headers.get('Accept-Language')).toBe('hu');
		req.flush({});
	});
});
