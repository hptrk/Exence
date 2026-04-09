import { Location } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../../../app/shared/auth/auth.service';
import { refreshTokenInterceptor } from '../../../app/shared/auth/interceptors/refresh-token.interceptor';
import { AccountRoutes } from '../../../app/shared/navigation/navigation-account.service';
import { NavigationService } from '../../../app/shared/navigation/navigation.service';
import { CurrentUserService } from '../../../app/shared/user/current-user.service';

// Yields control after all pending microtasks have settled
const tick = (): Promise<void> => new Promise<void>(resolve => setTimeout(resolve));

describe('refreshTokenInterceptor', () => {
	let http: HttpClient;
	let httpMock: HttpTestingController;
	let mockAuthService: jasmine.SpyObj<AuthService>;
	let mockRouter: jasmine.SpyObj<Router>;
	let mockNavigationService: jasmine.SpyObj<NavigationService>;
	let mockCurrentUserService: jasmine.SpyObj<CurrentUserService>;
	let mockLocation: jasmine.SpyObj<Location>;

	beforeEach(() => {
		mockAuthService = jasmine.createSpyObj('AuthService', ['refreshToken']);
		mockAuthService.refreshToken.and.returnValue(Promise.resolve({} as never));

		mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

		mockNavigationService = jasmine.createSpyObj('NavigationService', ['index', 'account']);
		mockNavigationService.index.and.returnValue('/');
		mockNavigationService.account.and.returnValue(new AccountRoutes());

		mockCurrentUserService = jasmine.createSpyObj('CurrentUserService', ['clearUser']);

		mockLocation = jasmine.createSpyObj('Location', ['path']);
		mockLocation.path.and.returnValue('/private/dashboard');

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([refreshTokenInterceptor])),
				provideHttpClientTesting(),
				{ provide: AuthService, useValue: mockAuthService },
				{ provide: Router, useValue: mockRouter },
				{ provide: NavigationService, useValue: mockNavigationService },
				{ provide: CurrentUserService, useValue: mockCurrentUserService },
				{ provide: Location, useValue: mockLocation },
			],
		});

		http = TestBed.inject(HttpClient);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpMock.verify());

	it('passes through /api/auth requests without catching errors', done => {
		http.get('/api/auth/login').subscribe({
			error: e => {
				expect(e?.status).toBe(401);
				expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
				done();
			},
		});

		httpMock.expectOne('/api/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
	});

	it('passes through requests without catching errors when on a public route', done => {
		mockLocation.path.and.returnValue('/public/login');

		http.get('/api/protected').subscribe({
			error: e => {
				expect(e?.status).toBe(401);
				expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
				done();
			},
		});

		httpMock.expectOne('/api/protected').flush({}, { status: 401, statusText: 'Unauthorized' });
	});

	it('re-throws errors that are not 401 or 403', done => {
		http.get('/api/protected').subscribe({
			error: e => {
				expect(e?.status).toBe(500);
				expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
				done();
			},
		});

		httpMock.expectOne('/api/protected').flush({}, { status: 500, statusText: 'Server Error' });
	});

	it('on 401, calls refreshToken and retries the original request', async () => {
		let result: unknown;

		http.get('/api/protected').subscribe(r => (result = r));

		httpMock.expectOne('/api/protected').flush({}, { status: 401, statusText: 'Unauthorized' });

		await tick();

		expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);

		const retryReq = httpMock.expectOne('/api/protected');
		retryReq.flush({ ok: true });

		expect(result).toEqual({ ok: true });
	});

	it('retried request includes withCredentials', async () => {
		http.get('/api/protected').subscribe();

		httpMock.expectOne('/api/protected').flush({}, { status: 401, statusText: 'Unauthorized' });

		await tick();

		const retryReq = httpMock.expectOne('/api/protected');
		expect(retryReq.request.withCredentials).toBeTrue();
		retryReq.flush({});
	});

	it('clears the current user and navigates to index when token refresh fails', async () => {
		mockAuthService.refreshToken.and.returnValue(Promise.reject(new Error('Refresh failed')));
		let errorReceived: unknown;

		http.get('/api/protected').subscribe({ error: e => (errorReceived = e) });

		httpMock.expectOne('/api/protected').flush({}, { status: 401, statusText: 'Unauthorized' });

		await tick();

		expect(mockCurrentUserService.clearUser).toHaveBeenCalled();
		expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
		expect(errorReceived).toBeTruthy();
	});
});
