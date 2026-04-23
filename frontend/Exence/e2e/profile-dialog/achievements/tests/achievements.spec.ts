import { expect, test } from '@playwright/test';
import { setupAchievements, setupAchievementsUnlocked } from '../utils/setup-achievements.util';
import {
	getAchievementAllRows,
	getAchievementDisabledRows,
	getAchievementProgressBar,
	getAchievementUnlockDate,
	getAchievementUnlockedRows,
	getAchievementsAllTabText,
	getAchievementsUnlockedEmpty,
	getAchievementsUnlockedTab,
	getAchievementsUnlockedTabText,
} from '../locators/achievements-locators';

// Achievements - Tab labels - mobile
test.describe('Achievements - Tab labels - mobile', () => {
	test.use({ viewport: { width: 700, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAchievements(page, context);
	});

	test('should show tab labels with icon only on mobile screens', async ({ page }) => {
		await expect(getAchievementsAllTabText(page)).not.toBeVisible();
		await expect(getAchievementsUnlockedTabText(page)).not.toBeVisible();
	});
});

// Achievements - Tab labels - large screen
test.describe('Achievements - Tab labels - large screen', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAchievements(page, context);
	});

	test('should show tab labels with icon and text on large screens', async ({ page }) => {
		await expect(getAchievementsAllTabText(page)).toBeVisible();
		await expect(getAchievementsUnlockedTabText(page)).toBeVisible();
	});
});

// Achievements - All tab - structure
test.describe('Achievements - All tab - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAchievements(page, context);
	});

	test('should show all achievements in the all tab', async ({ page }) => {
		const count = await getAchievementAllRows(page).count();
		expect(count).toBeGreaterThan(0);
	});

	test('should not show first row as disabled for a new user', async ({ page }) => {
		await expect(getAchievementAllRows(page).first()).not.toHaveAttribute('achievement-disabled');
	});

	test('should show empty state in unlocked tab for a new user', async ({ page }) => {
		await getAchievementsUnlockedTab(page).click();
		await expect(getAchievementsUnlockedEmpty(page)).toBeVisible();
	});
});

// Achievements - Unlocked state
test.describe('Achievements - Unlocked state', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAchievementsUnlocked(page, context);
	});

	test('should show first all-tab row as disabled after unlocking', async ({ page }) => {
		await expect(getAchievementDisabledRows(page).first()).toBeVisible();
	});

	test('should show 1 row in unlocked tab after unlocking', async ({ page }) => {
		await getAchievementsUnlockedTab(page).click();
		await expect(getAchievementUnlockedRows(page)).toHaveCount(1);
	});

	test('should show completed date on the first disabled all-tab card', async ({ page }) => {
		const firstDisabled = getAchievementDisabledRows(page).first();
		await expect(getAchievementUnlockDate(firstDisabled)).toBeVisible();
	});

	test('should show completed date and no progress bar on unlocked tab card', async ({ page }) => {
		await getAchievementsUnlockedTab(page).click();
		const unlockedCard = getAchievementUnlockedRows(page).first();
		await expect(getAchievementUnlockDate(unlockedCard)).toBeVisible();
		await expect(getAchievementProgressBar(unlockedCard)).not.toBeVisible();
	});
});
