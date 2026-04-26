import { Page } from '@playwright/test';
import { getTimeframeSelector } from '../locators/dashboard-locators';

export type TimeframeOption = '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'All';

export async function selectTimeframe(page: Page, timeframe: TimeframeOption): Promise<void> {
	const toggle = getTimeframeSelector(page);
	await toggle.getByText(timeframe, { exact: true }).click();
}
