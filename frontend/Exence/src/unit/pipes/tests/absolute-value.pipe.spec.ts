import { AbsoluteValuePipe } from '../../../app/shared/pipes/absolute-value.pipe';

describe('AbsoluteValuePipe', () => {
	let pipe: AbsoluteValuePipe;

	beforeEach(() => {
		pipe = new AbsoluteValuePipe();
	});

	it('returns the same value for a positive number', () => {
		expect(pipe.transform(5)).toBe(5);
	});

	it('returns the absolute value of a negative number', () => {
		expect(pipe.transform(-5)).toBe(5);
	});

	it('returns 0 for 0', () => {
		expect(pipe.transform(0)).toBe(0);
	});

	it('returns undefined for undefined', () => {
		expect(pipe.transform(undefined)).toBeUndefined();
	});

	it('handles large negative numbers', () => {
		expect(pipe.transform(-999999)).toBe(999999);
	});

	it('handles decimal numbers', () => {
		expect(pipe.transform(-3.14)).toBeCloseTo(3.14);
	});
});
