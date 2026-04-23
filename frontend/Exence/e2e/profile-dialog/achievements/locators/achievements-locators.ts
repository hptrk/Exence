import { Locator, Page } from '@playwright/test';

// Tab group
export const getAchievementsTabGroup = (page: Page): Locator => page.getByTestId('achievements-tab-group');

// Tab buttons (for navigation)
export const getAchievementsAllTab = (page: Page): Locator => getAchievementsTabGroup(page).getByRole('tab').nth(0);
export const getAchievementsUnlockedTab = (page: Page): Locator =>
	getAchievementsTabGroup(page).getByRole('tab').nth(1);

// Tab label texts (icon-only on mobile, icon+text on large screens)
export const getAchievementsAllTabText = (page: Page): Locator => page.getByTestId('achievements-all-tab-text');
export const getAchievementsUnlockedTabText = (page: Page): Locator =>
	page.getByTestId('achievements-unlocked-tab-text');

// Achievement rows — All tab
export const getAchievementAllRows = (page: Page): Locator => page.getByTestId('achievement-all-card');
export const getAchievementDisabledRows = (page: Page): Locator =>
	page.locator('[data-testid="achievement-all-card"][achievement-disabled]');

// Achievement rows — Unlocked tab
export const getAchievementUnlockedRows = (page: Page): Locator => page.getByTestId('achievement-unlocked-card');

// Achievement card elements (pass a card Locator)
export const getAchievementProgressBar = (card: Locator): Locator => card.getByTestId('achievement-progress-bar');
export const getAchievementProgressText = (card: Locator): Locator => card.getByTestId('achievement-progress-text');
export const getAchievementUnlockDate = (card: Locator): Locator => card.getByTestId('achievement-unlock-date');

// Empty states
export const getAchievementsAllEmpty = (page: Page): Locator => page.getByTestId('achievements-all-empty');
export const getAchievementsUnlockedEmpty = (page: Page): Locator => page.getByTestId('achievements-unlocked-empty');
