import { Locator } from '@playwright/test';

export async function fillAndBlur(field: Locator, value: string): Promise<void> {
	await field.click();
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
