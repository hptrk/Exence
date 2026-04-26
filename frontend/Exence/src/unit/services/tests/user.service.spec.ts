import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ChangePasswordRequest } from '../../../app/data-model/modules/auth/ChangePasswordRequest';
import { Role } from '../../../app/data-model/modules/auth/Role';
import { UserGet } from '../../../app/data-model/modules/auth/UserGet';
import { UserPatch } from '../../../app/data-model/modules/auth/UserPatch';
import { HttpService } from '../../../app/shared/http/http.service';
import { UserService } from '../../../app/shared/user/user.service';

const mockUser: UserGet = {
	id: 1,
	username: 'testuser',
	email: 'test@example.com',
	isVerified: true,
	role: Role.USER,
};

describe('UserService', () => {
	let service: UserService;
	let mockHttp: jasmine.SpyObj<HttpService>;

	beforeEach(() => {
		mockHttp = jasmine.createSpyObj<HttpService>('HttpService', ['get', 'patch', 'put', 'delete']);

		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection(), UserService, { provide: HttpService, useValue: mockHttp }],
		});

		service = TestBed.inject(UserService);
	});

	describe('getUser', () => {
		it('calls HttpService.get with /api/user/me and suppressErrorMessage: true', async () => {
			mockHttp.get.and.returnValue(of(mockUser));
			await service.getUser();
			expect(mockHttp.get).toHaveBeenCalledOnceWith('/api/user/me', undefined, { suppressErrorMessage: true });
		});

		it('returns the user from the response', async () => {
			mockHttp.get.and.returnValue(of(mockUser));
			const result = await service.getUser();
			expect(result).toEqual(mockUser);
		});
	});

	describe('updateUser', () => {
		it('calls HttpService.patch with /api/user and the request body', async () => {
			const request: UserPatch = { username: 'newname' };
			mockHttp.patch.and.returnValue(of(mockUser));
			await service.updateUser(request);
			expect(mockHttp.patch).toHaveBeenCalledOnceWith('/api/user', request);
		});

		it('returns the updated user', async () => {
			const request: UserPatch = { username: 'newname' };
			mockHttp.patch.and.returnValue(of({ ...mockUser, username: 'newname' }));
			const result = await service.updateUser(request);
			expect(result.username).toBe('newname');
		});
	});

	describe('changePassword', () => {
		it('calls HttpService.put with /api/user/password and the request body', async () => {
			const request: ChangePasswordRequest = {
				oldPassword: 'old',
				newPassword: 'New!pass1',
				confirmNewPassword: 'New!pass1',
			};
			mockHttp.put.and.returnValue(of(undefined as never));
			await service.changePassword(request);
			expect(mockHttp.put).toHaveBeenCalledOnceWith('/api/user/password', request);
		});
	});

	describe('deleteUser', () => {
		it('calls HttpService.delete with /api/user', async () => {
			mockHttp.delete.and.returnValue(of(undefined));
			await service.deleteUser();
			expect(mockHttp.delete).toHaveBeenCalledOnceWith('/api/user');
		});
	});
});
