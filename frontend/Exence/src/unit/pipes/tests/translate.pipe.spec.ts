import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

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
});
