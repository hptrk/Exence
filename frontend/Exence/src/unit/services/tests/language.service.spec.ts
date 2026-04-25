import { provideZonelessChangeDetection, WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';

import { Role } from '../../../app/data-model/modules/auth/Role';
import { UserGet } from '../../../app/data-model/modules/auth/UserGet';
import { LanguageService } from '../../../app/private/profile-dialog/user-settings/language-select/language.service';
import { LocalStorageService } from '../../../app/shared/local-storage.service';
import { CurrentUserService } from '../../../app/shared/user/current-user.service';

const BARE_KEY = 'language';
const mockUser: UserGet = { id: 42, username: 'test', email: 'test@test.com', isVerified: true, role: Role.USER };

function scopedKey(userId: number): string {
	return `${userId}:language`;
}

describe('LanguageService', () => {
	let mockTransloco: jasmine.SpyObj<TranslocoService> & { langChanges$: Subject<string> };
	let userSignal: WritableSignal<UserGet | null | undefined>;

	function create(): LanguageService {
		userSignal = signal<UserGet | null | undefined>(null);
		const spy = jasmine.createSpyObj<TranslocoService>('TranslocoService', ['getActiveLang', 'setActiveLang']);
		(spy as unknown as { langChanges$: Subject<string> }).langChanges$ = new Subject<string>();
		spy.getActiveLang.and.returnValue('en');
		mockTransloco = spy as jasmine.SpyObj<TranslocoService> & { langChanges$: Subject<string> };

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				LanguageService,
				LocalStorageService,
				{ provide: TranslocoService, useValue: mockTransloco },
				{ provide: CurrentUserService, useValue: { user: userSignal.asReadonly() } },
			],
		});
		const service = TestBed.inject(LanguageService);
		TestBed.flushEffects();
		return service;
	}

	afterEach(() => {
		localStorage.removeItem(BARE_KEY);
		localStorage.removeItem(scopedKey(mockUser.id));
	});

	it('constructor calls setActiveLang with the stored language when localStorage has an entry', () => {
		localStorage.setItem(BARE_KEY, 'hu');
		create();
		expect(mockTransloco.setActiveLang).toHaveBeenCalledWith('hu');
	});

	it('constructor does not call setActiveLang when localStorage is empty', () => {
		create();
		expect(mockTransloco.setActiveLang).not.toHaveBeenCalled();
	});

	it('language signal reflects the active language from TranslocoService', () => {
		const service = create();
		expect(service.language()).toBe('en');
	});

	it('setLanguage calls TranslocoService.setActiveLang with the given language', () => {
		const service = create();
		service.setLanguage('fr');
		expect(mockTransloco.setActiveLang).toHaveBeenCalledWith('fr');
	});

	it('setLanguage persists the language to localStorage (bare key when unauthenticated)', () => {
		const service = create();
		service.setLanguage('fr');
		expect(localStorage.getItem(BARE_KEY)).toBe('fr');
	});

	it('setLanguage with no argument is a no-op', () => {
		const service = create();
		service.setLanguage();
		expect(mockTransloco.setActiveLang).not.toHaveBeenCalled();
		expect(localStorage.getItem(BARE_KEY)).toBeNull();
	});

	it('reads from scoped key when user is authenticated', () => {
		localStorage.setItem(scopedKey(mockUser.id), 'fr');
		const service = create();
		expect(mockTransloco.setActiveLang).not.toHaveBeenCalled();

		userSignal.set(mockUser);
		TestBed.flushEffects();
		expect(mockTransloco.setActiveLang).toHaveBeenCalledWith('fr');
		void service;
	});

	it('setLanguage persists to scoped key when user is authenticated', () => {
		const service = create();
		userSignal.set(mockUser);
		service.setLanguage('hu');
		expect(localStorage.getItem(scopedKey(mockUser.id))).toBe('hu');
		expect(localStorage.getItem(BARE_KEY)).toBeNull();
	});
});
