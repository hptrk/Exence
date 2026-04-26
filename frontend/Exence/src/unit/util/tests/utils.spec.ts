import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { convertToParamMap } from '@angular/router';

import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { TransactionType } from '../../../app/data-model/modules/transaction/TransactionType';
import {
	buildLinks,
	buildNodeMap,
	detectDateGranularity,
	detectSeriesDateGranularity,
	findHubNode,
	formatDateLabel,
	formatDateTooltip,
	formatNumber,
	getAmountStep,
	getCssVariableValue,
	getFilters,
	lightenHexColor,
	localizeCurrency,
	mapToTransactionFilter,
	resolveNodeId,
	toRawValueSignal,
} from '../../../app/shared/util/utils';
import { fullTransactionFilter, hubSankeyLinks, mixedSankeyLinks, simpleSankeyLinks } from '../data/utils.data';

describe('localizeCurrency', () => {
	it('returns EUR symbol for EUR in English', () => {
		const result = localizeCurrency(SupportedCurrency.EUR, 'en');
		expect(result).toBe('€');
	});

	it('returns USD symbol for USD in English', () => {
		const result = localizeCurrency(SupportedCurrency.USD, 'en');
		expect(result).toBe('$');
	});

	it('returns HUF symbol for HUF in Hungarian', () => {
		const result = localizeCurrency(SupportedCurrency.HUF, 'hu');
		expect(result).toBe('Ft');
	});

	it('returns GBP symbol for GBP in English', () => {
		const result = localizeCurrency(SupportedCurrency.GBP, 'en');
		expect(result).toBe('£');
	});
});

describe('mapToTransactionFilter', () => {
	it('returns empty object for empty ParamMap', () => {
		const result = mapToTransactionFilter(convertToParamMap({}));
		expect(result).toEqual({} as object);
	});

	it('maps keyword param', () => {
		const result = mapToTransactionFilter(convertToParamMap({ keyword: 'coffee' }));
		expect(result.keyword).toBe('coffee');
	});

	it('maps dateFrom and dateTo params', () => {
		const result = mapToTransactionFilter(convertToParamMap({ dateFrom: '2024-01-01', dateTo: '2024-12-31' }));
		expect(result.dateFrom).toBe('2024-01-01');
		expect(result.dateTo).toBe('2024-12-31');
	});

	it('converts categoryId to number', () => {
		const result = mapToTransactionFilter(convertToParamMap({ categoryId: '42' }));
		expect(result.categoryId).toBe(42);
	});

	it('maps type param as TransactionType', () => {
		const result = mapToTransactionFilter(convertToParamMap({ type: TransactionType.EXPENSE }));
		expect(result.type).toBe(TransactionType.EXPENSE);
	});

	it('converts amountFrom and amountTo to floats', () => {
		const result = mapToTransactionFilter(convertToParamMap({ amountFrom: '10.5', amountTo: '500.0' }));
		expect(result.amountFrom).toBe(10.5);
		expect(result.amountTo).toBe(500.0);
	});

	it('converts createdByRecurringJob to true when value is "true"', () => {
		const result = mapToTransactionFilter(convertToParamMap({ createdByRecurringJob: 'true' }));
		expect(result.createdByRecurringJob).toBe(true);
	});

	it('converts createdByRecurringJob to false when value is not "true"', () => {
		const result = mapToTransactionFilter(convertToParamMap({ createdByRecurringJob: 'false' }));
		expect(result.createdByRecurringJob).toBe(false);
	});

	it('maps all fields from full param map', () => {
		const result = mapToTransactionFilter(
			convertToParamMap({
				keyword: 'groceries',
				dateFrom: '2024-01-01',
				dateTo: '2024-12-31',
				categoryId: '42',
				type: TransactionType.EXPENSE,
				amountFrom: '10.5',
				amountTo: '500',
				createdByRecurringJob: 'true',
			}),
		);
		expect(result.keyword).toBe('groceries');
		expect(result.categoryId).toBe(42);
		expect(result.type).toBe(TransactionType.EXPENSE);
		expect(result.createdByRecurringJob).toBe(true);
	});
});

describe('getFilters', () => {
	it('returns empty object when called with undefined', () => {
		expect(getFilters(undefined)).toEqual({});
	});

	it('returns empty object when called with no argument', () => {
		expect(getFilters()).toEqual({});
	});

	it('returns a deep clone of the filter object', () => {
		const result = getFilters(fullTransactionFilter) as Record<string, unknown>;
		expect(result['keyword']).toBe('groceries');
		expect(result['categoryId']).toBe(42);
	});

	it('does not return the same reference as the input', () => {
		const result = getFilters(fullTransactionFilter) as unknown;
		expect(result).not.toBe(fullTransactionFilter as unknown);
	});

	it('returns empty object for an empty filter', () => {
		expect(getFilters({})).toEqual({});
	});
});

describe('lightenHexColor', () => {
	it('lightens pure black to a mid-gray with default amount', () => {
		const result = lightenHexColor('#000000');
		// 30% of 255 = 76.5 → 77 = 0x4d
		expect(result).toBe('#4d4d4d');
	});

	it('returns pure white unchanged', () => {
		const result = lightenHexColor('#ffffff');
		expect(result).toBe('#ffffff');
	});

	it('lightens with a custom amount of 0', () => {
		const result = lightenHexColor('#808080', 0);
		expect(result).toBe('#808080');
	});

	it('lightens fully to white with amount 1', () => {
		const result = lightenHexColor('#000000', 1);
		expect(result).toBe('#ffffff');
	});

	it('handles hex without # prefix', () => {
		const result = lightenHexColor('000000', 1);
		expect(result).toBe('#ffffff');
	});
});

describe('findHubNode', () => {
	it('returns undefined when there are no mixed nodes', () => {
		const sourceNames = new Set(['Salary']);
		const targetNames = new Set(['Food', 'Rent']);
		const result = findHubNode(simpleSankeyLinks, sourceNames, targetNames);
		expect(result).toBeUndefined();
	});

	it('returns the hub node that appears in both source and target sets', () => {
		const sourceNames = new Set(['Salary', 'Savings']);
		const targetNames = new Set(['Savings', 'Investment']);
		const result = findHubNode(mixedSankeyLinks, sourceNames, targetNames);
		expect(result).toBe('Savings');
	});

	it('returns the node with the highest edge count among mixed nodes', () => {
		const sourceNames = new Set(['Income', 'Bonus', 'Hub']);
		const targetNames = new Set(['Hub', 'Food', 'Rent']);
		const result = findHubNode(hubSankeyLinks, sourceNames, targetNames);
		expect(result).toBe('Hub');
	});

	it('returns undefined for empty data', () => {
		const result = findHubNode([], new Set(), new Set());
		expect(result).toBeUndefined();
	});
});

describe('resolveNodeId', () => {
	it('returns plain name when not in mixedCategories', () => {
		const result = resolveNodeId('Salary', 'source', new Set(['Food']));
		expect(result).toBe('Salary');
	});

	it('appends _source when name is in mixedCategories and side is source', () => {
		const result = resolveNodeId('Savings', 'source', new Set(['Savings']));
		expect(result).toBe('Savings_source');
	});

	it('appends _target when name is in mixedCategories and side is target', () => {
		const result = resolveNodeId('Savings', 'target', new Set(['Savings']));
		expect(result).toBe('Savings_target');
	});

	it('returns plain name when mixedCategories is empty', () => {
		const result = resolveNodeId('Income', 'source', new Set());
		expect(result).toBe('Income');
	});
});

describe('buildNodeMap', () => {
	it('creates nodes for both from and to in a single link', () => {
		const result = buildNodeMap(simpleSankeyLinks, new Set());
		expect(result.has('Salary')).toBe(true);
		expect(result.has('Food')).toBe(true);
		expect(result.has('Rent')).toBe(true);
	});

	it('assigns correct node names', () => {
		const result = buildNodeMap(simpleSankeyLinks, new Set());
		expect(result.get('Salary')?.name).toBe('Salary');
		expect(result.get('Food')?.name).toBe('Food');
	});

	it('uses suffixed IDs for mixed categories', () => {
		const result = buildNodeMap(mixedSankeyLinks, new Set(['Savings']));
		expect(result.has('Savings_source')).toBe(true);
		expect(result.has('Savings_target')).toBe(true);
		expect(result.has('Savings')).toBe(false);
	});

	it('does not duplicate nodes for repeated sources', () => {
		const result = buildNodeMap(simpleSankeyLinks, new Set());
		// Salary appears as source in both links but should only appear once
		let salaryCount = 0;
		result.forEach((_, key) => {
			if (key === 'Salary') salaryCount++;
		});
		expect(salaryCount).toBe(1);
	});
});

describe('buildLinks', () => {
	it('builds links with plain IDs when no mixed categories', () => {
		const result = buildLinks(simpleSankeyLinks, new Set());
		expect(result[0].source).toBe('Salary');
		expect(result[0].target).toBe('Food');
	});

	it('uses suffixed IDs for mixed category links', () => {
		const result = buildLinks(mixedSankeyLinks, new Set(['Savings']));
		const savingsLink = result.find(l => l.source === 'Savings_source' || l.target === 'Savings_target');
		expect(savingsLink).toBeTruthy();
	});

	it('preserves value and color from original links', () => {
		const result = buildLinks(simpleSankeyLinks, new Set());
		expect(result[0].value).toBe(500);
		expect(result[0].color).toBe('#ff0000');
	});

	it('returns correct number of links', () => {
		const result = buildLinks(simpleSankeyLinks, new Set());
		expect(result.length).toBe(simpleSankeyLinks.length);
	});
});

describe('formatNumber', () => {
	it('returns plain string for values below 10000', () => {
		expect(formatNumber(9999)).toBe('9999');
		expect(formatNumber(0)).toBe('0');
		expect(formatNumber(1234)).toBe('1234');
	});

	it('returns formatted string with grouping for values >= 10000', () => {
		const result = formatNumber(10000);
		expect(result).toContain('10');
		expect(result.length).toBeGreaterThan(5);
	});

	it('formats large numbers with thousand separators', () => {
		const result = formatNumber(1000000, 'en-US');
		expect(result).toContain('1,000,000');
	});

	it('handles negative numbers below -10000', () => {
		const result = formatNumber(-10000);
		expect(result).toContain('10');
	});

	it('handles exactly 9999 as plain string', () => {
		expect(formatNumber(9999)).toBe('9999');
	});
});

describe('detectDateGranularity', () => {
	it('returns "day" for YYYY-MM-DD format', () => {
		expect(detectDateGranularity('2024-01-15')).toBe('day');
	});

	it('returns "month" for YYYY-MM format', () => {
		expect(detectDateGranularity('2024-01')).toBe('month');
	});

	it('returns null for invalid format', () => {
		expect(detectDateGranularity('invalid')).toBeNull();
		expect(detectDateGranularity('2024')).toBeNull();
		expect(detectDateGranularity('')).toBeNull();
	});

	it('returns "day" when YYYY-MM-DD has trailing content', () => {
		// The regex uses /^\d{4}-\d{2}-\d{2}/ (no $), so datetime strings match as 'day'
		expect(detectDateGranularity('2024-01-15T12:00:00')).toBe('day');
	});
});

describe('formatDateLabel', () => {
	it('formats a month-granularity string as "Mon YYYY"', () => {
		const result = formatDateLabel('2024-01', 'en-US');
		expect(result).toContain('2024');
		expect(result).toMatch(/Jan/i);
	});

	it('formats a day-granularity string as "Mon YYYY"', () => {
		const result = formatDateLabel('2024-06-15', 'en-US');
		expect(result).toContain('2024');
		expect(result).toMatch(/Jun/i);
	});

	it('returns original string for invalid date', () => {
		const result = formatDateLabel('invalid', 'en-US');
		expect(result).toBe('invalid');
	});

	it('uses explicit granularity override when provided', () => {
		// passing granularity=null causes passthrough of non-date strings
		const result = formatDateLabel('not-a-date', 'en-US', null);
		expect(result).toBe('not-a-date');
	});

	it('formats a numeric timestamp value', () => {
		const ts = new Date('2024-03-01').getTime();
		const result = formatDateLabel(ts, 'en-US', 'month');
		expect(result).toContain('2024');
	});
});

describe('formatDateTooltip', () => {
	it('formats month granularity with full month name', () => {
		const result = formatDateTooltip('2024-01', 'en-US');
		expect(result).toContain('January');
		expect(result).toContain('2024');
	});

	it('formats day granularity with full date', () => {
		const result = formatDateTooltip('2024-06-15', 'en-US');
		expect(result).toContain('June');
		expect(result).toContain('15');
		expect(result).toContain('2024');
	});

	it('returns original string for null granularity', () => {
		const result = formatDateTooltip('no-date', 'en-US');
		expect(result).toBe('no-date');
	});

	it('formats a numeric timestamp with explicit granularity', () => {
		const ts = new Date('2024-03-05').getTime();
		const result = formatDateTooltip(ts, 'en-US', 'day');
		expect(result).toContain('March');
		expect(result).toContain('2024');
	});
});

describe('getAmountStep', () => {
	it('returns eurAmount × 100 for HUF', () => {
		expect(getAmountStep(1, SupportedCurrency.HUF)).toBe(100);
		expect(getAmountStep(5, SupportedCurrency.HUF)).toBe(500);
	});

	it('returns eurAmount × 5 for CZK', () => {
		expect(getAmountStep(1, SupportedCurrency.CZK)).toBe(5);
		expect(getAmountStep(2, SupportedCurrency.CZK)).toBe(10);
	});

	it('returns eurAmount × 1 for EUR, USD, GBP, and other currencies', () => {
		expect(getAmountStep(1, SupportedCurrency.EUR)).toBe(1);
		expect(getAmountStep(1, SupportedCurrency.USD)).toBe(1);
		expect(getAmountStep(1, SupportedCurrency.GBP)).toBe(1);
	});

	it('handles fractional base amounts', () => {
		expect(getAmountStep(0.5, SupportedCurrency.HUF)).toBe(50);
		expect(getAmountStep(0.1, SupportedCurrency.CZK)).toBeCloseTo(0.5);
	});
});

describe('getCssVariableValue', () => {
	let el: HTMLElement;

	beforeEach(() => {
		el = document.createElement('div');
		document.body.appendChild(el);
	});

	afterEach(() => {
		document.body.removeChild(el);
	});

	it('returns the value of a CSS custom property set on an element', () => {
		el.style.setProperty('--test-color', 'red');
		expect(getCssVariableValue('--test-color', el)).toBe('red');
	});

	it('returns an empty string for a custom property that is not set', () => {
		expect(getCssVariableValue('--nonexistent', el)).toBe('');
	});

	it('returns an empty string when element is null', () => {
		expect(getCssVariableValue('--test-color', null)).toBe('');
	});

	it('defaults to document.documentElement when no element is provided', () => {
		document.documentElement.style.setProperty('--root-var', 'blue');
		expect(getCssVariableValue('--root-var')).toBe('blue');
		document.documentElement.style.removeProperty('--root-var');
	});
});

describe('detectSeriesDateGranularity', () => {
	it('returns null for empty series', () => {
		expect(detectSeriesDateGranularity([])).toBeNull();
	});

	it('returns null for series with no data points', () => {
		expect(detectSeriesDateGranularity([{ data: [] }])).toBeNull();
	});

	it('returns "month" when first data point is YYYY-MM', () => {
		const series = [{ data: [{ x: '2024-01' }, { x: '2024-02' }] }];
		expect(detectSeriesDateGranularity(series)).toBe('month');
	});

	it('returns "day" when first data point is YYYY-MM-DD', () => {
		const series = [{ data: [{ x: '2024-01-15' }, { x: '2024-01-16' }] }];
		expect(detectSeriesDateGranularity(series)).toBe('day');
	});

	it('returns granularity from first valid point across multiple series', () => {
		const series = [{ data: [{ x: '2024-06' }] }, { data: [{ x: '2024-01-01' }] }];
		expect(detectSeriesDateGranularity(series)).toBe('month');
	});
});

describe('toRawValueSignal', () => {
	it('returns a signal with the initial raw value of the control', () => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		const ctrl = new FormControl('hello');
		const sig = TestBed.runInInjectionContext(() => toRawValueSignal(ctrl));
		expect(sig()).toBe('hello');
	});

	it('updates the signal when the control value changes', () => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		const ctrl = new FormControl('initial');
		const sig = TestBed.runInInjectionContext(() => toRawValueSignal(ctrl));
		ctrl.setValue('updated');
		TestBed.flushEffects();
		expect(sig()).toBe('updated');
	});

	it('captures the raw value of a disabled control', () => {
		TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
		});
		const ctrl = new FormControl({ value: 'disabled-value', disabled: true });
		const sig = TestBed.runInInjectionContext(() => toRawValueSignal(ctrl));
		expect(sig()).toBe('disabled-value');
	});
});
