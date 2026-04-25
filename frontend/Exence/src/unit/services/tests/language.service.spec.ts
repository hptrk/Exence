import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';

import { LanguageService } from '../../../app/private/profile-dialog/user-settings/language-select/language.service';

const STORAGE_KEY = 'language';

describe('LanguageService', () => {
	let mockTransloco: jasmine.SpyObj<TranslocoService> & { langChanges$: Subject<string> };

	function create(): LanguageService {
		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				LanguageService,
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		});
		return TestBed.inject(LanguageService);
	}

	beforeEach(() => {
		const spy = jasmine.createSpyObj<TranslocoService>('TranslocoService', ['getActiveLang', 'setActiveLang']);
		(spy as unknown as { langChanges$: Subject<string> }).langChanges$ = new Subject<string>();
		spy.getActiveLang.and.returnValue('en');
		mockTransloco = spy as jasmine.SpyObj<TranslocoService> & { langChanges$: Subject<string> };
		localStorage.removeItem(STORAGE_KEY);
	});

	afterEach(() => localStorage.removeItem(STORAGE_KEY));

	it('constructor calls setActiveLang with the stored language when localStorage has an entry', () => {
		localStorage.setItem(STORAGE_KEY, 'hu');
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

	it('setLanguage persists the language to localStorage', () => {
		const service = create();
		service.setLanguage('fr');
		expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
	});

	it('setLanguage with no argument is a no-op', () => {
		const service = create();
		service.setLanguage();
		expect(mockTransloco.setActiveLang).not.toHaveBeenCalled();
		expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
	});
});
