import { Page, Request } from '@playwright/test';

export function waitForLayoutGet(page: Page): Promise<Request> {
	return page.waitForRequest(req => req.url().includes('/api/statistics/widgets/layout') && req.method() === 'GET');
}

export function waitForLayoutPut(page: Page): Promise<Request> {
	return page.waitForRequest(req => req.url().includes('/api/statistics/widgets/layout') && req.method() === 'PUT');
}

export function waitForWidgetCreate(page: Page): Promise<Request> {
	return page.waitForRequest(req => req.url().includes('/api/statistics/widgets') && req.method() === 'POST');
}

export async function assertNoPutSent(page: Page, action: () => Promise<void>): Promise<void> {
	let putSent = false;
	const handler = (req: Request): void => {
		if (req.url().includes('/api/statistics/widgets/layout') && req.method() === 'PUT') {
			putSent = true;
		}
	};
	page.on('request', handler);
	await action();
	await page.waitForTimeout(500);
	page.off('request', handler);
	if (putSent) {
		throw new Error('Expected no PUT request to layout, but one was sent');
	}
}
