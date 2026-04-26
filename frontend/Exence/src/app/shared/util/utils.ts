import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { CategoryFilter } from '../../data-model/modules/category/CategoryFilter';
import { SankeyLink } from '../../data-model/modules/statistics/WidgetDataPayload';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../data-model/modules/user-settings/SupportedCurrency';
import { AuditLogFilter } from '../../data-model/modules/audit-log/AuditLogFilter';

const CURRENCY_STEP_MULTIPLIERS: Record<SupportedCurrency, number> = {
	[SupportedCurrency.HUF]: 100,
	[SupportedCurrency.EUR]: 1,
	[SupportedCurrency.USD]: 1,
	[SupportedCurrency.CAD]: 1,
	[SupportedCurrency.GBP]: 1,
	[SupportedCurrency.CHF]: 1,
	[SupportedCurrency.PLN]: 1,
	[SupportedCurrency.CZK]: 5,
	[SupportedCurrency.RON]: 1,
};

export function getAmountStep(eurAmount: number, currency: SupportedCurrency): number {
	return eurAmount * CURRENCY_STEP_MULTIPLIERS[currency];
}

export function toRawValueSignal<T>(control: AbstractControl<unknown, T>): Signal<T> {
	return toSignal(control.valueChanges.pipe(map(() => control.getRawValue() as T)), {
		initialValue: control.getRawValue() as T,
	});
}

export function localizeCurrency(currency: SupportedCurrency, lang: string): string {
	const formatter = new Intl.NumberFormat(lang, {
		style: 'currency',
		currencyDisplay: 'narrowSymbol',
		currency: currency.toUpperCase(),
	});
	const symbol = formatter.formatToParts(0).find(part => part.type === 'currency');
	return symbol ? symbol.value : currency;
}

export function mapToTransactionFilter(queryParam: ParamMap): TransactionFilter {
	const filter: TransactionFilter = {} as TransactionFilter;
	if (queryParam.get('keyword')) filter.keyword = queryParam.get('keyword')!;
	if (queryParam.get('dateFrom')) filter.dateFrom = queryParam.get('dateFrom')!;
	if (queryParam.get('dateTo')) filter.dateTo = queryParam.get('dateTo')!;
	if (queryParam.get('categoryId')) filter.categoryId = +queryParam.get('categoryId')!;
	if (queryParam.get('type')) filter.type = queryParam.get('type')! as TransactionType;
	if (queryParam.get('amountFrom')) filter.amountFrom = parseFloat(queryParam.get('amountFrom')!);
	if (queryParam.get('amountTo')) filter.amountTo = parseFloat(queryParam.get('amountTo')!);
	if (queryParam.get('createdByRecurringJob'))
		filter.createdByRecurringJob = queryParam.get('createdByRecurringJob') === 'true';
	return filter;
}

export function getFilters(filters?: TransactionFilter | CategoryFilter | AuditLogFilter): Record<string, string> {
	if (filters) return JSON.parse(JSON.stringify(filters)) as Record<string, string>;
	return {} satisfies Record<string, string>;
}

export function lightenHexColor(hex: string, amount = 0.3): string {
	const num = parseInt(hex.replace('#', ''), 16);
	const r = Math.min(255, Math.round((num >> 16) + (255 - (num >> 16)) * amount));
	const g = Math.min(255, Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
	const b = Math.min(255, Math.round((num & 0xff) + (255 - (num & 0xff)) * amount));
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function findHubNode(
	data: SankeyLink[],
	sourceNames: Set<string>,
	targetNames: Set<string>,
): string | undefined {
	const mixedNames = [...sourceNames].filter(name => targetNames.has(name));

	const edgeCount = new Map<string, number>();
	data.forEach(link => {
		edgeCount.set(link.from, (edgeCount.get(link.from) ?? 0) + 1);
		edgeCount.set(link.to, (edgeCount.get(link.to) ?? 0) + 1);
	});

	return mixedNames.reduce<string | undefined>((maxName, name) => {
		const count = edgeCount.get(name) ?? 0;
		const maxCount = maxName ? (edgeCount.get(maxName) ?? 0) : 0;
		return count > maxCount ? name : maxName;
	}, undefined);
}

export function resolveNodeId(name: string, side: 'source' | 'target', mixedCategories: Set<string>): string {
	return mixedCategories.has(name) ? `${name}_${side}` : name;
}

export function buildNodeMap(
	data: SankeyLink[],
	mixedCategories: Set<string>,
): Map<string, { id: string; name: string; color?: string }> {
	const nodeMap = new Map<string, { id: string; name: string; color: string }>();

	data.forEach(link => {
		const fromId = resolveNodeId(link.from, 'source', mixedCategories);
		if (!nodeMap.has(fromId)) {
			nodeMap.set(fromId, {
				id: fromId,
				name: link.from,
				color: link.color,
			});
		}

		const toId = resolveNodeId(link.to, 'target', mixedCategories);
		if (!nodeMap.has(toId)) {
			nodeMap.set(toId, {
				id: toId,
				name: link.to,
				color: link.color,
			});
		}
	});
	return nodeMap;
}

export function buildLinks(
	data: SankeyLink[],
	mixedCategories: Set<string>,
): { source: string; target: string; value: number; color: string }[] {
	return data.map(link => ({
		source: resolveNodeId(link.from, 'source', mixedCategories),
		target: resolveNodeId(link.to, 'target', mixedCategories),
		value: link.value,
		color: link.color,
	}));
}

export const getCssVariableValue = (
	variableName: string,
	element: HTMLElement | null | undefined = document.documentElement,
): string => {
	if (!element) return '';
	return getComputedStyle(element).getPropertyValue(variableName).trim();
};

export function formatNumber(value: number, locale = 'hu-HU'): string {
	if (Math.abs(value) < 10000) return value.toString();
	return new Intl.NumberFormat(locale, {
		useGrouping: true,
	})
		.format(value)
		.replace(/\u00a0/g, ' ');
}

export type DateGranularity = 'month' | 'day';

export function detectDateGranularity(value: string): DateGranularity | null {
	if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'day';
	if (/^\d{4}-\d{2}$/.test(value)) return 'month';
	return null;
}

export function formatDateLabel(value: string | number, locale: string, granularity?: DateGranularity | null): string {
	const resolved = granularity ?? (typeof value === 'string' ? detectDateGranularity(value) : null);

	if (!resolved) return String(value);

	const date = typeof value === 'number' ? new Date(value) : new Date(value);
	if (isNaN(date.getTime())) return String(value);

	return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short' }).format(date);
}

export function formatDateTooltip(
	value: string | number,
	locale: string,
	granularity?: DateGranularity | null,
): string {
	const resolved = granularity ?? (typeof value === 'string' ? detectDateGranularity(value) : null);
	if (!resolved) return String(value);

	const date = typeof value === 'number' ? new Date(value) : new Date(value);
	if (isNaN(date.getTime())) return String(value);

	const options: Intl.DateTimeFormatOptions =
		resolved === 'month' ? { year: 'numeric', month: 'long' } : { year: 'numeric', month: 'long', day: 'numeric' };
	return new Intl.DateTimeFormat(locale, options).format(date);
}

export function detectSeriesDateGranularity(series: { data: { x: string }[] }[]): DateGranularity | null {
	for (const si of series) {
		for (const dp of si.data) {
			const g = detectDateGranularity(dp.x);
			if (g) return g;
		}
	}
	return null;
}
