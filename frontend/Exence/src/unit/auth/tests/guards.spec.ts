import { Signal, WritableSignal, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

import { adminGuard } from '../../../app/shared/auth/guard/admin.guard';
import { hasChangesGuard, HasChangesComponent } from '../../../app/shared/auth/guard/has-changes.guard';
import { loggedInGuard } from '../../../app/shared/auth/guard/logged-in.guard';
import { loggedOutGuard } from '../../../app/shared/auth/guard/logged-out.guard';
import { ConfirmExitService } from '../../../app/shared/confirm-exit.service';
import { NavigationService } from '../../../app/shared/navigation/navigation.service';
import { CurrentUserService } from '../../../app/shared/user/current-user.service';
import { Role } from '../../../app/data-model/modules/auth/Role';
import { UserGet } from '../../../app/data-model/modules/auth/UserGet';

// Shared fixtures
const mockUser: UserGet = {
	id: 1,
	username: 'testuser',
	email: 'test@example.com',
	isVerified: true,
	role: Role.USER,
};

const mockAdminUser: UserGet = { ...mockUser, role: Role.ADMIN };

function makeRoute(queryParams: Record<string, string> = {}): ActivatedRouteSnapshot {
	return { queryParams } as unknown as ActivatedRouteSnapshot;
}

function makeState(url = '/dashboard'): RouterStateSnapshot {
	return { url } as RouterStateSnapshot;
}

// Resolves the boolean or Observable<boolean> returned by CanActivateFn guards
function resolveCanActivate(result: boolean | Observable<boolean>): Promise<boolean> {
	if (typeof result === 'boolean') return Promise.resolve(result);
	return firstValueFrom(result);
}

// loggedInGuard
describe('loggedInGuard', () => {
	let userSignal: WritableSignal<UserGet | undefined>;
	let mockCurrentUserService: {
		user: Signal<UserGet | undefined>;
		isAuthenticated: jasmine.Spy;
		isAdmin: jasmine.Spy;
	};
	let mockNavigationService: { account: jasmine.Spy; private: jasmine.Spy };
	let mockRouter: jasmine.SpyObj<Router>;

	beforeEach(() => {
		userSignal = signal<UserGet | undefined>(undefined);
		mockCurrentUserService = {
			user: userSignal.asReadonly(),
			isAuthenticated: jasmine.createSpy('isAuthenticated').and.callFake(() => userSignal() !== undefined),
			isAdmin: jasmine.createSpy('isAdmin').and.callFake(() => userSignal()?.role === Role.ADMIN),
		};
		mockNavigationService = {
			account: jasmine.createSpy('account').and.returnValue({ login: () => '/public/login' }),
			private: jasmine.createSpy('private').and.returnValue({ dashboard: () => '/dashboard' }),
		};
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				{ provide: CurrentUserService, useValue: mockCurrentUserService },
				{ provide: NavigationService, useValue: mockNavigationService },
				{ provide: Router, useValue: mockRouter },
			],
		});
	});

	it('returns true when user is authenticated', async () => {
		userSignal.set(mockUser);

		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(
				loggedInGuard(makeRoute(), makeState('/private/dashboard')) as boolean | Observable<boolean>,
			);
		});

		expect(result).toBeTrue();
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it('redirects to login with returnUrl when user is unauthenticated', async () => {
		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(
				loggedInGuard(makeRoute(), makeState('/private/dashboard')) as boolean | Observable<boolean>,
			);
		});

		expect(result).toBeFalse();
		expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/public/login'], {
			queryParams: { returnUrl: '/private/dashboard' },
		});
	});

	it('includes the correct returnUrl in the query params', async () => {
		await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(
				loggedInGuard(makeRoute(), makeState('/transactions?page=2')) as boolean | Observable<boolean>,
			);
		});

		expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/public/login'], {
			queryParams: { returnUrl: '/transactions?page=2' },
		});
	});
});

// loggedOutGuard
describe('loggedOutGuard', () => {
	let userSignal: WritableSignal<UserGet | undefined>;
	let mockCurrentUserService: {
		user: Signal<UserGet | undefined>;
		isAuthenticated: jasmine.Spy;
		isAdmin: jasmine.Spy;
	};
	let mockNavigationService: { account: jasmine.Spy; private: jasmine.Spy };
	let mockRouter: jasmine.SpyObj<Router>;

	beforeEach(() => {
		userSignal = signal<UserGet | undefined>(undefined);
		mockCurrentUserService = {
			user: userSignal.asReadonly(),
			isAuthenticated: jasmine.createSpy('isAuthenticated').and.callFake(() => userSignal() !== undefined),
			isAdmin: jasmine.createSpy('isAdmin').and.callFake(() => userSignal()?.role === Role.ADMIN),
		};
		mockNavigationService = {
			account: jasmine.createSpy('account').and.returnValue({ login: () => '/public/login' }),
			private: jasmine.createSpy('private').and.returnValue({ dashboard: () => '/dashboard' }),
		};
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				{ provide: CurrentUserService, useValue: mockCurrentUserService },
				{ provide: NavigationService, useValue: mockNavigationService },
				{ provide: Router, useValue: mockRouter },
			],
		});
	});

	it('returns true immediately when password-changed query param is true', async () => {
		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(
				loggedOutGuard(makeRoute({ 'password-changed': 'true' }), makeState('/public/login')) as
					| boolean
					| Observable<boolean>,
			);
		});

		expect(result).toBeTrue();
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it('returns true when user is unauthenticated', async () => {
		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(
				loggedOutGuard(makeRoute(), makeState('/public/login')) as boolean | Observable<boolean>,
			);
		});

		expect(result).toBeTrue();
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it('redirects to dashboard when user is already authenticated', async () => {
		userSignal.set(mockUser);

		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(
				loggedOutGuard(makeRoute(), makeState('/public/login')) as boolean | Observable<boolean>,
			);
		});

		expect(result).toBeFalse();
		expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/dashboard']);
	});

	it('does not redirect when password-changed param is not true', async () => {
		await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(
				loggedOutGuard(makeRoute({ 'password-changed': 'false' }), makeState('/public/login')) as
					| boolean
					| Observable<boolean>,
			);
		});

		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});
});

// adminGuard
describe('adminGuard', () => {
	let userSignal: WritableSignal<UserGet | undefined>;
	let mockCurrentUserService: {
		user: Signal<UserGet | undefined>;
		isAuthenticated: jasmine.Spy;
		isAdmin: jasmine.Spy;
	};
	let mockNavigationService: { account: jasmine.Spy; private: jasmine.Spy };
	let mockRouter: jasmine.SpyObj<Router>;

	beforeEach(() => {
		userSignal = signal<UserGet | undefined>(undefined);
		mockCurrentUserService = {
			user: userSignal.asReadonly(),
			isAuthenticated: jasmine.createSpy('isAuthenticated').and.callFake(() => userSignal() !== undefined),
			isAdmin: jasmine.createSpy('isAdmin').and.callFake(() => userSignal()?.role === Role.ADMIN),
		};
		mockNavigationService = {
			account: jasmine.createSpy('account').and.returnValue({ login: () => '/public/login' }),
			private: jasmine.createSpy('private').and.returnValue({ dashboard: () => '/dashboard' }),
		};
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				{ provide: CurrentUserService, useValue: mockCurrentUserService },
				{ provide: NavigationService, useValue: mockNavigationService },
				{ provide: Router, useValue: mockRouter },
			],
		});
	});

	it('returns true when user has admin role', async () => {
		userSignal.set(mockAdminUser);

		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(adminGuard(makeRoute(), makeState('/admin')) as boolean | Observable<boolean>);
		});

		expect(result).toBeTrue();
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it('redirects to dashboard when user has user role', async () => {
		userSignal.set(mockUser);

		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(adminGuard(makeRoute(), makeState('/admin')) as boolean | Observable<boolean>);
		});

		expect(result).toBeFalse();
		expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/dashboard']);
	});

	it('redirects to dashboard when user is unauthenticated', async () => {
		const result = await TestBed.runInInjectionContext(() => {
			return resolveCanActivate(adminGuard(makeRoute(), makeState('/admin')) as boolean | Observable<boolean>);
		});

		expect(result).toBeFalse();
		expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/dashboard']);
	});
});

// hasChangesGuard
describe('hasChangesGuard', () => {
	let mockConfirmExitService: jasmine.SpyObj<ConfirmExitService>;

	function makeComponent(hasChanges: boolean): HasChangesComponent {
		return { hasChanges: () => hasChanges };
	}

	beforeEach(() => {
		mockConfirmExitService = jasmine.createSpyObj('ConfirmExitService', ['hasChanges', 'showConfirmDialog']);

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				{ provide: ConfirmExitService, useValue: mockConfirmExitService },
			],
		});
	});

	it('returns true when neither component nor service has changes', async () => {
		mockConfirmExitService.hasChanges.and.returnValue(false);

		const result = await TestBed.runInInjectionContext(() =>
			hasChangesGuard(makeComponent(false), makeRoute(), makeState(), makeState()),
		);

		expect(result).toBeTrue();
		expect(mockConfirmExitService.showConfirmDialog).not.toHaveBeenCalled();
	});

	it('shows confirm dialog when component has changes', async () => {
		mockConfirmExitService.hasChanges.and.returnValue(false);
		mockConfirmExitService.showConfirmDialog.and.resolveTo(true);

		const result = await TestBed.runInInjectionContext(() =>
			hasChangesGuard(makeComponent(true), makeRoute(), makeState(), makeState()),
		);

		expect(mockConfirmExitService.showConfirmDialog).toHaveBeenCalledTimes(1);
		expect(result).toBeTrue();
	});

	it('shows confirm dialog when service has changes', async () => {
		mockConfirmExitService.hasChanges.and.returnValue(true);
		mockConfirmExitService.showConfirmDialog.and.resolveTo(true);

		const result = await TestBed.runInInjectionContext(() =>
			hasChangesGuard(makeComponent(false), makeRoute(), makeState(), makeState()),
		);

		expect(mockConfirmExitService.showConfirmDialog).toHaveBeenCalledTimes(1);
		expect(result).toBeTrue();
	});

	it('returns false when user cancels the confirm dialog', async () => {
		mockConfirmExitService.hasChanges.and.returnValue(true);
		mockConfirmExitService.showConfirmDialog.and.resolveTo(false);

		const result = await TestBed.runInInjectionContext(() =>
			hasChangesGuard(makeComponent(false), makeRoute(), makeState(), makeState()),
		);

		expect(result).toBeFalse();
	});

	it('shows confirm dialog when both component and service have changes', async () => {
		mockConfirmExitService.hasChanges.and.returnValue(true);
		mockConfirmExitService.showConfirmDialog.and.resolveTo(true);

		await TestBed.runInInjectionContext(() =>
			hasChangesGuard(makeComponent(true), makeRoute(), makeState(), makeState()),
		);

		expect(mockConfirmExitService.showConfirmDialog).toHaveBeenCalledTimes(1);
	});
});
