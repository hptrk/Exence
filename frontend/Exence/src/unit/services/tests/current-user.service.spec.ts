import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Role } from '../../../app/data-model/modules/auth/Role';
import { UserGet } from '../../../app/data-model/modules/auth/UserGet';
import { CurrentUserService } from '../../../app/shared/user/current-user.service';

const mockUser: UserGet = {
	id: 1,
	username: 'testuser',
	email: 'test@example.com',
	isVerified: true,
	role: Role.USER,
};

const mockAdmin: UserGet = { ...mockUser, role: Role.ADMIN };

describe('CurrentUserService', () => {
	let service: CurrentUserService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection(), CurrentUserService],
		});

		service = TestBed.inject(CurrentUserService);
	});

	it('isAuthenticated is false when no user is set', () => {
		expect(service.isAuthenticated()).toBeFalse();
	});

	it('isAdmin is false when no user is set', () => {
		expect(service.isAdmin()).toBeFalse();
	});

	it('isAuthenticated becomes true after setting a user', () => {
		service.user = mockUser;
		expect(service.isAuthenticated()).toBeTrue();
	});

	it('isAdmin is false for a user with USER role', () => {
		service.user = mockUser;
		expect(service.isAdmin()).toBeFalse();
	});

	it('isAdmin is true for a user with ADMIN role', () => {
		service.user = mockAdmin;
		expect(service.isAdmin()).toBeTrue();
	});

	it('user getter returns the current signal value', () => {
		service.user = mockUser;
		expect(service.user()).toEqual(mockUser);
	});

	it('clearUser sets isAuthenticated back to false', () => {
		service.user = mockUser;
		service.clearUser();
		expect(service.isAuthenticated()).toBeFalse();
	});

	it('clearUser sets isAdmin back to false', () => {
		service.user = mockAdmin;
		service.clearUser();
		expect(service.isAdmin()).toBeFalse();
	});
});
