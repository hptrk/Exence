import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { OrdinalPipe } from '../../../app/shared/pipes/ordinal.pipe';
import { ordinalData } from '../data/pipes.data';

describe('OrdinalPipe', () => {
	let pipe: OrdinalPipe;
	let mockTransloco: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		mockTransloco = jasmine.createSpyObj('TranslocoService', ['getActiveLang']);

		TestBed.configureTestingModule({
			providers: [OrdinalPipe, { provide: TranslocoService, useValue: mockTransloco }],
		});

		pipe = TestBed.inject(OrdinalPipe);
	});

	describe('English (en)', () => {
		beforeEach(() => mockTransloco.getActiveLang.and.returnValue('en'));

		for (const { input, expected } of ordinalData['en']) {
			it(`formats ${input} as "${expected}"`, () => {
				expect(pipe.transform(input)).toBe(expected);
			});
		}
	});

	describe('French (fr)', () => {
		beforeEach(() => mockTransloco.getActiveLang.and.returnValue('fr'));

		for (const { input, expected } of ordinalData['fr']) {
			it(`formats ${input} as "${expected}"`, () => {
				expect(pipe.transform(input)).toBe(expected);
			});
		}
	});

	describe('Spanish (es)', () => {
		beforeEach(() => mockTransloco.getActiveLang.and.returnValue('es'));

		for (const { input, expected } of ordinalData['es']) {
			it(`formats ${input} as "${expected}"`, () => {
				expect(pipe.transform(input)).toBe(expected);
			});
		}
	});

	describe('Italian (it)', () => {
		beforeEach(() => mockTransloco.getActiveLang.and.returnValue('it'));

		for (const { input, expected } of ordinalData['it']) {
			it(`formats ${input} as "${expected}"`, () => {
				expect(pipe.transform(input)).toBe(expected);
			});
		}
	});

	describe('Default locale (hu and others)', () => {
		beforeEach(() => mockTransloco.getActiveLang.and.returnValue('hu'));

		for (const { input, expected } of ordinalData['hu']) {
			it(`formats ${input} as "${expected}"`, () => {
				expect(pipe.transform(input)).toBe(expected);
			});
		}

		it('applies default format for unrecognised locale', () => {
			mockTransloco.getActiveLang.and.returnValue('xx');
			expect(pipe.transform(7)).toBe('7.');
		});
	});
});
