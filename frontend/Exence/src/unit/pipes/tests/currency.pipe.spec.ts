import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { CurrencyService } from '../../../app/shared/currency.service';
import { CurrencyPipe } from '../../../app/shared/pipes/currency.pipe';

describe('CurrencyPipe', () => {
	let pipe: CurrencyPipe;
	let mockTransloco: jasmine.SpyObj<TranslocoService>;
	let mockCurrencyService: { baseCurrency: () => SupportedCurrency };

	beforeEach(() => {
		mockTransloco = jasmine.createSpyObj('TranslocoService', ['getActiveLang']);
		mockTransloco.getActiveLang.and.returnValue('en');

		mockCurrencyService = { baseCurrency: () => SupportedCurrency.EUR };

		TestBed.configureTestingModule({
			providers: [
				CurrencyPipe,
				{ provide: TranslocoService, useValue: mockTransloco },
				{ provide: CurrencyService, useValue: mockCurrencyService },
			],
		});

		pipe = TestBed.inject(CurrencyPipe);
	});

	it('returns empty string for undefined', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('returns empty string for null', () => {
		expect(pipe.transform(null)).toBe('');
	});

	it('returns the original string for a non-numeric string', () => {
		expect(pipe.transform('not-a-number')).toBe('not-a-number');
	});

	it('formats a number with an explicit currency', () => {
		const result = pipe.transform(1234, SupportedCurrency.EUR);
		expect(result).toContain('1,234');
		expect(result).toContain('€');
	});

	it('formats a number with decimal places', () => {
		const result = pipe.transform(1234.5, SupportedCurrency.EUR);
		expect(result).toContain('1,234.5');
	});

	it('formats a numeric string as a number', () => {
		const result = pipe.transform('500', SupportedCurrency.EUR);
		expect(result).toContain('500');
		expect(result).toContain('€');
	});

	it('uses the service base currency when no currency is provided', () => {
		mockCurrencyService.baseCurrency = () => SupportedCurrency.USD;
		const result = pipe.transform(100);
		expect(result).toContain('$');
		expect(result).toContain('100');
	});

	it('formats zero correctly', () => {
		const result = pipe.transform(0, SupportedCurrency.EUR);
		expect(result).toContain('€');
		expect(result).toContain('0');
	});

	it('formats negative values correctly', () => {
		const result = pipe.transform(-50, SupportedCurrency.EUR);
		expect(result).toContain('50');
	});
});
