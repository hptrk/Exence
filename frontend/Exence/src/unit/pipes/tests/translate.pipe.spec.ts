import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoPipe } from '@jsverse/transloco';

import { TranslatePipe } from '../../../app/shared/pipes/translate.pipe';

describe('TranslatePipe', () => {
	let pipe: TranslatePipe;
	let mockTransloco: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		mockTransloco = jasmine.createSpyObj('TranslocoService', ['translate', 'selectTranslate', 'getActiveLang'], {
			reRenderOnLangChange: false,
		});
		mockTransloco.translate.and.returnValue('translated');
		mockTransloco.selectTranslate.and.returnValue({ subscribe: () => ({ unsubscribe: () => {} }) } as never);

		TestBed.configureTestingModule({
			providers: [
				TranslatePipe,
				{ provide: TranslocoService, useValue: mockTransloco },
				{ provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
			],
		});

		pipe = TestBed.inject(TranslatePipe);
	});

	it('creates the pipe', () => {
		expect(pipe).toBeTruthy();
	});

	it('transform delegates to the parent TranslocoPipe and returns the result', () => {
		spyOn(TranslocoPipe.prototype, 'transform').and.returnValue('translated');
		const result = pipe.transform('some.key' as never);
		expect(result).toBe('translated');
	});

	it('transform passes params through to the parent TranslocoPipe', () => {
		const parentSpy = spyOn(TranslocoPipe.prototype, 'transform').and.returnValue('translated with params');
		const params = { count: 3 };
		pipe.transform('some.key' as never, params);
		expect(parentSpy).toHaveBeenCalledWith('some.key', params);
	});
});
