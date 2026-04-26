import { Locator, Page } from '@playwright/test';

// This session
export const getSessionsThisSessionTitle = (page: Page): Locator => page.getByTestId('sessions-this-session-title');
export const getSessionsCurrentItem = (page: Page): Locator => page.getByTestId('sessions-current-item');
export const getSessionsCurrentLastUsed = (page: Page): Locator => page.getByTestId('sessions-current-last-used');

// Security info
export const getSessionsSecurityInfo = (page: Page): Locator => page.getByTestId('sessions-security-info');

// Other sessions
export const getSessionsOtherTitle = (page: Page): Locator => page.getByTestId('sessions-other-sessions-title');
export const getSessionsOtherItems = (page: Page): Locator => page.getByTestId('sessions-other-item');
export const getSessionsOtherDeleteBtns = (page: Page): Locator => page.getByTestId('sessions-other-delete-btn');
export const getSessionsDeleteAllBtn = (page: Page): Locator => page.getByTestId('sessions-delete-all-btn');
