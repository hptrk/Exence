import { Page, Request } from '@playwright/test';
import dashboardData from '../data/dashboard.data.json';

export function waitForChartRequest(page: Page, expectedTimeframe: string): Promise<Request> {
	return page.waitForRequest(
		req =>
			req.url().includes(dashboardData.api.dashboardWidgets) &&
			new URL(req.url()).searchParams.get('timeframe') === expectedTimeframe,
	);
}
