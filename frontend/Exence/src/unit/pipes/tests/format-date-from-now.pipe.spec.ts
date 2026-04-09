import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { FormatDateFromNowPipe } from '../../../app/shared/pipes/format-date-from-now.pipe';

// Frozen reference point: 2024-06-15 12:00:00 UTC
const NOW = new Date('2024-06-15T12:00:00.000Z');

function secondsAgo(s: number): Date {
	return new Date(NOW.getTime() - s * 1000);
}

function minutesAgo(m: number): Date {
	return secondsAgo(m * 60);
}

function hoursAgo(h: number): Date {
	return minutesAgo(h * 60);
}

function daysAgo(d: number): Date {
	return hoursAgo(d * 24);
}

describe('FormatDateFromNowPipe', () => {
	let pipe: FormatDateFromNowPipe;
	let mockTransloco: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		jasmine.clock().install();
		jasmine.clock().mockDate(NOW);

		mockTransloco = jasmine.createSpyObj('TranslocoService', ['translate']);
		(mockTransloco.translate as jasmine.Spy).and.callFake((key: string, params?: Record<string, unknown>) =>
			params !== undefined ? `${key}:${JSON.stringify(params)}` : key,
		);

		TestBed.configureTestingModule({
			providers: [FormatDateFromNowPipe, { provide: TranslocoService, useValue: mockTransloco }],
		});

		pipe = TestBed.inject(FormatDateFromNowPipe);
	});

	afterEach(() => {
		jasmine.clock().uninstall();
	});

	// Edge cases
	it('returns empty string for undefined', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('returns empty string for an invalid date string', () => {
		expect(pipe.transform('not-a-date')).toBe('');
	});

	// "Now" — less than 15 seconds ago
	it('returns "now" translation for 10 seconds ago', () => {
		expect(pipe.transform(secondsAgo(10))).toBe('formattedDate.now');
	});

	it('returns "now" translation for 0 seconds ago', () => {
		expect(pipe.transform(NOW)).toBe('formattedDate.now');
	});

	// Seconds - 15 to 59 seconds ago
	it('uses "secs" key for 30 seconds ago', () => {
		expect(pipe.transform(secondsAgo(30))).toBe('formattedDate.secs:{"value":30}');
	});

	it('uses "secs" key for 59 seconds ago', () => {
		expect(pipe.transform(secondsAgo(59))).toBe('formattedDate.secs:{"value":59}');
	});

	// Minutes — 1 to 59 minutes ago
	it('uses "min" key for exactly 1 minute ago', () => {
		expect(pipe.transform(minutesAgo(1))).toBe('formattedDate.min:{"value":1}');
	});

	it('uses "mins" key for 5 minutes ago', () => {
		expect(pipe.transform(minutesAgo(5))).toBe('formattedDate.mins:{"value":5}');
	});

	it('uses "mins" key for 59 minutes ago', () => {
		expect(pipe.transform(minutesAgo(59))).toBe('formattedDate.mins:{"value":59}');
	});

	// Hours — 1 to 23 hours ago
	it('uses "hour" key for exactly 1 hour ago', () => {
		expect(pipe.transform(hoursAgo(1))).toBe('formattedDate.hour:{"value":1}');
	});

	it('uses "hours" key for 5 hours ago', () => {
		expect(pipe.transform(hoursAgo(5))).toBe('formattedDate.hours:{"value":5}');
	});

	it('uses "hours" key for 23 hours ago', () => {
		expect(pipe.transform(hoursAgo(23))).toBe('formattedDate.hours:{"value":23}');
	});

	// Days — 1 to 6 days ago
	it('uses "formattedDate.day" key for exactly 1 day ago', () => {
		expect(pipe.transform(daysAgo(1))).toBe('formattedDate.day:{"value":1}');
	});

	it('uses "formattedDate.days" key for 3 days ago', () => {
		expect(pipe.transform(daysAgo(3))).toBe('formattedDate.days:{"value":3}');
	});

	// ---------------------------------------------------------------------------
	// Within the same year — month/day format
	// ---------------------------------------------------------------------------

	it('returns month translation for a date within the current year', () => {
		// 2024-06-15 now; 2024-02-10 is ~125 days ago, same year
		const date = new Date('2024-02-10T12:00:00.000Z');
		const result = pipe.transform(date);
		expect(result).toContain('months.feb');
		expect(result).toContain('"day":10');
	});

	// ---------------------------------------------------------------------------
	// Older than a year — dd/MM/yyyy
	// ---------------------------------------------------------------------------

	it('returns dd/MM/yyyy for a date more than one year ago', () => {
		const date = new Date('2020-03-05T00:00:00.000Z');
		expect(pipe.transform(date)).toBe('05/03/2020');
	});

	it('accepts a timestamp (number) as input', () => {
		expect(pipe.transform(NOW.getTime())).toBe('formattedDate.now');
	});

	it('accepts a date string as input', () => {
		expect(pipe.transform('2024-06-15T11:59:30.000Z')).toBe('formattedDate.secs:{"value":30}');
	});
});
