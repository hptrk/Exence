import { format, subDays } from 'date-fns';
import { Locator } from '@playwright/test';

export async function fillAndBlur(field: Locator, value: string): Promise<void> {
	await field.scrollIntoViewIfNeeded();
	await field.focus();
	await field.fill(value);
	await field.blur();
}

export function getCurrentDate(): string {
	return new Date()
		.toLocaleString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		})
		.replace(/[^\d]/g, '_');
}

export function getDateDaysAgo(days: number): Date {
	return subDays(new Date(), days);
}

/** Format a date as shown in the transaction list date column: yy/MM/dd */
export function formatDateForList(date: Date): string {
	return format(date, 'yy/MM/dd');
}

/** Format a date for the datepicker input field (enUS locale): MM/dd/yyyy */
export function formatDateForInput(date: Date): string {
	return format(date, 'MM/dd/yyyy');
}

export function createUniqueName(): string {
	const now = new Date();
	const yy = String(now.getFullYear()).slice(-2);
	const MM = String(now.getMonth() + 1).padStart(2, '0');
	const dd = String(now.getDate()).padStart(2, '0');
	const HH = String(now.getHours()).padStart(2, '0');
	const mm = String(now.getMinutes()).padStart(2, '0');
	const SS = String(now.getSeconds()).padStart(2, '0');
	return `${yy}_${MM}_${dd}_${HH}_${mm}_${SS}`;
}
