import { expect, test } from '@playwright/test';
import { attemptLogin } from '../../auth/auth';
import { getErrorSnackbar, getSnackbarCloseBtn } from '../../snackbar/locators/snackbar-locators';
import {
	getAccountSettingsMenuItem,
	getLanguageMenuItem,
	getLanguageSelectBtn,
	getLogoCompact,
	getLogoHorizontal,
	getLogoutBtn,
	getLogoutMenuItem,
	getManageAccountsBtn,
	getMobileMoreActionsBtn,
	getMobileNavDashboardBtn,
	getMobileNavDebtsBtn,
	getMobileNavGoalsBtn,
	getMobileNavHomeBtn,
	getMobileNavLoginBtn,
	getMobileNavRegisterBtn,
	getMobileNavStatisticsBtn,
	getMobileNavTransactionsBtn,
	getMobileNavigation,
	getMoreActionsBtn,
	getNavDashboardBtn,
	getNavDebtsBtn,
	getNavGoalsBtn,
	getNavHomeBtn,
	getNavLoginBtn,
	getNavRegisterBtn,
	getNavStatisticsBtn,
	getNavTransactionsBtn,
	getProfileDialog,
	getSidebar,
	getThemeBtn,
	getThemeMenuItem,
} from '../locators/sidebar-locators';

test.describe('Sidebar — unauthenticated, xl (≥1280px)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' });
		await page.addInitScript(() => {
			localStorage.setItem('language', 'en');
			localStorage.removeItem('themePreference');
		});
		await page.goto('/', { waitUntil: 'domcontentloaded' });
		if (await getErrorSnackbar(page).isVisible()) {
			await getSnackbarCloseBtn(page).click();
		}
	});

	test('should display sidebar and not bottom navbar', async ({ page }) => {
		await expect(getSidebar(page)).toBeVisible();
		await expect(getMobileNavigation(page)).not.toBeVisible();
	});

	test('should display horizontal logo', async ({ page }) => {
		await expect(getLogoHorizontal(page)).toBeVisible();
		await expect(getLogoCompact(page)).not.toBeVisible();
	});

	test('should display navigation button with text', async ({ page }) => {
		await expect(getNavHomeBtn(page)).toBeVisible();
		await expect(getNavHomeBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavHomeBtn(page)).toContainText('Home');

		await expect(getNavLoginBtn(page)).toBeVisible();
		await expect(getNavLoginBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavLoginBtn(page)).toContainText('Log in');

		await expect(getNavRegisterBtn(page)).toBeVisible();
		await expect(getNavRegisterBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavRegisterBtn(page)).toContainText('Registration');
	});

	test('should navigation buttons navigate to the correct pages and have active class', async ({ page }) => {
		await getNavRegisterBtn(page).click();
		await page.waitForURL('/public/register');
		await expect(getNavRegisterBtn(page)).toHaveClass(/active/);
		await expect(getNavHomeBtn(page)).not.toHaveClass(/active/);
		await expect(getNavLoginBtn(page)).not.toHaveClass(/active/);

		await getNavLoginBtn(page).click();
		await page.waitForURL('/public/login');
		await expect(getNavLoginBtn(page)).toHaveClass(/active/);
		await expect(getNavHomeBtn(page)).not.toHaveClass(/active/);
		await expect(getNavRegisterBtn(page)).not.toHaveClass(/active/);

		await getNavHomeBtn(page).click();
		await page.waitForURL('/');
		await expect(getNavHomeBtn(page)).toHaveClass(/active/);
		await expect(getNavLoginBtn(page)).not.toHaveClass(/active/);
		await expect(getNavRegisterBtn(page)).not.toHaveClass(/active/);
	});

	test('should display action buttons', async ({ page }) => {
		await expect(getLanguageSelectBtn(page)).toBeVisible();
		await expect(getThemeBtn(page)).toBeVisible();
		await expect(getManageAccountsBtn(page)).not.toBeVisible();
		await expect(getLogoutBtn(page)).not.toBeVisible();
		await expect(getMoreActionsBtn(page)).not.toBeVisible();
	});

	test('should theme changer work', async ({ page }) => {
		const initial = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(initial).toBeNull();

		await getThemeBtn(page).locator('button').click();
		const after1 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after1).toBe('secondary');

		await getThemeBtn(page).locator('button').click();
		const after2 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after2).toBe('primary');
	});

	test('should change language via language button', async ({ page }) => {
		await expect(getLanguageSelectBtn(page)).toBeVisible();
		await getLanguageSelectBtn(page).locator('button').click();

		const huOption = page.getByRole('menuitem', { name: /HU.*Magyar/i });
		await huOption.click();

		const lang = await page.evaluate(() => localStorage.getItem('language'));
		expect(lang).toBe('hu');
	});
});

test.describe('Sidebar — authenticated, xl (≥1280px)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' });
		await page.addInitScript(() => {
			localStorage.setItem('language', 'en');
			localStorage.removeItem('themePreference');
		});
		await attemptLogin(page, 'user');
		await page.evaluate(() => localStorage.setItem('language', 'en'));
		await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
	});

	test('should display sidebar and not bottom navbar', async ({ page }) => {
		await expect(getSidebar(page)).toBeVisible();
		await expect(getMobileNavigation(page)).not.toBeVisible();
	});

	test('should display horizontal logo', async ({ page }) => {
		await expect(getLogoHorizontal(page)).toBeVisible();
		await expect(getLogoCompact(page)).not.toBeVisible();
	});

	test('should display navigation button with text', async ({ page }) => {
		await expect(getNavDashboardBtn(page)).toBeVisible();
		await expect(getNavDashboardBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavDashboardBtn(page)).toContainText('Dashboard');

		await expect(getNavTransactionsBtn(page)).toBeVisible();
		await expect(getNavTransactionsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavTransactionsBtn(page)).toContainText('Transactions');

		await expect(getNavStatisticsBtn(page)).toBeVisible();
		await expect(getNavStatisticsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavStatisticsBtn(page)).toContainText('Statistics');

		await expect(getNavGoalsBtn(page)).toBeVisible();
		await expect(getNavGoalsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavGoalsBtn(page)).toContainText('Goals');

		await expect(getNavDebtsBtn(page)).toBeVisible();
		await expect(getNavDebtsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavDebtsBtn(page)).toContainText('Debts');
	});

	test('should navigation buttons navigate to the correct pages and have active class', async ({ page }) => {
		await getNavTransactionsBtn(page).click();
		await page.waitForURL('/transactions');
		await expect(getNavTransactionsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getNavStatisticsBtn(page).click();
		await page.waitForURL('/statistics');
		await expect(getNavStatisticsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getNavGoalsBtn(page).click();
		await page.waitForURL('/goals');
		await expect(getNavGoalsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getNavDebtsBtn(page).click();
		await page.waitForURL('/debts');
		await expect(getNavDebtsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);

		await getNavDashboardBtn(page).click();
		await page.waitForURL('/dashboard');
		await expect(getNavDashboardBtn(page)).toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);
	});

	test('should display action buttons', async ({ page }) => {
		await expect(getManageAccountsBtn(page)).toBeVisible();
		await expect(getThemeBtn(page)).toBeVisible();
		await expect(getLogoutBtn(page)).toBeVisible();
		await expect(getLanguageSelectBtn(page)).not.toBeVisible();
		await expect(getMoreActionsBtn(page)).not.toBeVisible();
	});

	test('should theme changer work', async ({ page }) => {
		const initial = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(initial).toBeNull();

		await getThemeBtn(page).locator('button').click();
		const after1 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after1).toBe('secondary');

		await getThemeBtn(page).locator('button').click();
		const after2 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after2).toBe('primary');
	});

	test('should open profile dialog', async ({ page }) => {
		await expect(getManageAccountsBtn(page)).toBeVisible();
		await getManageAccountsBtn(page).click();
		await expect(getProfileDialog(page)).toBeVisible();
	});

	test('should log out', async ({ page }) => {
		await expect(getLogoutBtn(page)).toBeVisible();
		await getLogoutBtn(page).click();
		await page.waitForURL('/public/login');
	});
});

test.describe('Sidebar — unauthenticated, md (768–1279px)', () => {
	test.use({ viewport: { width: 900, height: 700 } });

	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' });
		await page.addInitScript(() => {
			localStorage.setItem('language', 'en');
			localStorage.removeItem('themePreference');
		});
		await page.goto('/', { waitUntil: 'domcontentloaded' });
		if (await getErrorSnackbar(page).isVisible()) {
			await getSnackbarCloseBtn(page).click();
		}
	});

	test('should display sidebar and not bottom navbar', async ({ page }) => {
		await expect(getSidebar(page)).toBeVisible();
		await expect(getMobileNavigation(page)).not.toBeVisible();
	});

	test('should display compact logo', async ({ page }) => {
		await expect(getLogoCompact(page)).toBeVisible();
		await expect(getLogoHorizontal(page)).not.toBeVisible();
	});

	test('should display navigation button without text', async ({ page }) => {
		await expect(getNavHomeBtn(page)).toBeVisible();
		await expect(getNavHomeBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavHomeBtn(page)).toContainText('');

		await expect(getNavLoginBtn(page)).toBeVisible();
		await expect(getNavLoginBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavLoginBtn(page)).toContainText('');

		await expect(getNavRegisterBtn(page)).toBeVisible();
		await expect(getNavRegisterBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavRegisterBtn(page)).toContainText('');
	});

	test('should navigation buttons navigate to the correct pages and have active class', async ({ page }) => {
		await getNavRegisterBtn(page).click();
		await page.waitForURL('/public/register');
		await expect(getNavRegisterBtn(page)).toHaveClass(/active/);
		await expect(getNavHomeBtn(page)).not.toHaveClass(/active/);
		await expect(getNavLoginBtn(page)).not.toHaveClass(/active/);

		await getNavLoginBtn(page).click();
		await page.waitForURL('/public/login');
		await expect(getNavLoginBtn(page)).toHaveClass(/active/);
		await expect(getNavHomeBtn(page)).not.toHaveClass(/active/);
		await expect(getNavRegisterBtn(page)).not.toHaveClass(/active/);

		await getNavHomeBtn(page).click();
		await page.waitForURL('/');
		await expect(getNavHomeBtn(page)).toHaveClass(/active/);
		await expect(getNavLoginBtn(page)).not.toHaveClass(/active/);
		await expect(getNavRegisterBtn(page)).not.toHaveClass(/active/);
	});

	test('should display more button instead of action buttons', async ({ page }) => {
		await expect(getMoreActionsBtn(page)).toBeVisible();
		await expect(getLanguageSelectBtn(page)).not.toBeVisible();
		await expect(getThemeBtn(page)).not.toBeVisible();
		await expect(getManageAccountsBtn(page)).not.toBeVisible();
		await expect(getLogoutBtn(page)).not.toBeVisible();
	});

	test('should more actions display menu with action buttons', async ({ page }) => {
		await expect(getMoreActionsBtn(page)).toBeVisible();
		await getMoreActionsBtn(page).click();

		await expect(getLanguageMenuItem(page)).toBeVisible();
		await expect(getLanguageMenuItem(page).locator('mat-icon')).toBeVisible();
		await expect(getLanguageMenuItem(page)).toContainText('Change language');

		await expect(getThemeMenuItem(page)).toBeVisible();
		await expect(getThemeMenuItem(page).locator('mat-icon')).toBeVisible();
		await expect(getThemeMenuItem(page)).toContainText('Primary/secondary mode');

		await expect(getAccountSettingsMenuItem(page)).not.toBeVisible();
		await expect(getLogoutMenuItem(page)).not.toBeVisible();
	});

	test('should theme changer work', async ({ page }) => {
		const initial = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(initial).toBeNull();

		await expect(getMoreActionsBtn(page)).toBeVisible();

		await getMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		const after1 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after1).toBe('secondary');
		await expect(getThemeMenuItem(page)).not.toBeVisible();

		await getMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		const after2 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after2).toBe('primary');
		await expect(getThemeMenuItem(page)).not.toBeVisible();
	});

	test('should change language via more menu', async ({ page }) => {
		await expect(getMoreActionsBtn(page)).toBeVisible();
		await getMoreActionsBtn(page).click();
		await expect(getLanguageMenuItem(page)).toBeVisible();
		await getLanguageMenuItem(page).click();

		const huOption = page.getByRole('menuitem', { name: /HU.*Magyar/i });
		await huOption.click();

		const lang = await page.evaluate(() => localStorage.getItem('language'));
		expect(lang).toBe('hu');
	});
});

test.describe('Sidebar — authenticated, md (768–1279px)', () => {
	test.use({ viewport: { width: 900, height: 700 } });

	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' });
		await page.addInitScript(() => {
			localStorage.setItem('language', 'en');
			localStorage.removeItem('themePreference');
		});
		await attemptLogin(page, 'user');
		await page.evaluate(() => localStorage.setItem('language', 'en'));
		await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
	});

	test('should display sidebar and not bottom navbar', async ({ page }) => {
		await expect(getSidebar(page)).toBeVisible();
		await expect(getMobileNavigation(page)).not.toBeVisible();
	});

	test('should display compact logo', async ({ page }) => {
		await expect(getLogoCompact(page)).toBeVisible();
		await expect(getLogoHorizontal(page)).not.toBeVisible();
	});

	test('should display navigation button without text', async ({ page }) => {
		await expect(getNavDashboardBtn(page)).toBeVisible();
		await expect(getNavDashboardBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavDashboardBtn(page)).toContainText('');

		await expect(getNavTransactionsBtn(page)).toBeVisible();
		await expect(getNavTransactionsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavTransactionsBtn(page)).toContainText('');

		await expect(getNavStatisticsBtn(page)).toBeVisible();
		await expect(getNavStatisticsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavStatisticsBtn(page)).toContainText('');

		await expect(getNavGoalsBtn(page)).toBeVisible();
		await expect(getNavGoalsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavGoalsBtn(page)).toContainText('');

		await expect(getNavDebtsBtn(page)).toBeVisible();
		await expect(getNavDebtsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getNavDebtsBtn(page)).toContainText('');
	});

	test('should navigation buttons navigate to the correct pages and have active class', async ({ page }) => {
		await getNavTransactionsBtn(page).click();
		await page.waitForURL('/transactions');
		await expect(getNavTransactionsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getNavStatisticsBtn(page).click();
		await page.waitForURL('/statistics');
		await expect(getNavStatisticsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getNavGoalsBtn(page).click();
		await page.waitForURL('/goals');
		await expect(getNavGoalsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getNavDebtsBtn(page).click();
		await page.waitForURL('/debts');
		await expect(getNavDebtsBtn(page)).toHaveClass(/active/);
		await expect(getNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);

		await getNavDashboardBtn(page).click();
		await page.waitForURL('/dashboard');
		await expect(getNavDashboardBtn(page)).toHaveClass(/active/);
		await expect(getNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getNavDebtsBtn(page)).not.toHaveClass(/active/);
	});

	test('should display more button instead of action buttons', async ({ page }) => {
		await expect(getMoreActionsBtn(page)).toBeVisible();
		await expect(getLanguageSelectBtn(page)).not.toBeVisible();
		await expect(getThemeBtn(page)).not.toBeVisible();
		await expect(getManageAccountsBtn(page)).not.toBeVisible();
		await expect(getLogoutBtn(page)).not.toBeVisible();
	});

	test('should more actions display menu with action buttons', async ({ page }) => {
		await expect(getMoreActionsBtn(page)).toBeVisible();
		await getMoreActionsBtn(page).click();

		await expect(getAccountSettingsMenuItem(page)).toBeVisible();
		await expect(getAccountSettingsMenuItem(page).locator('mat-icon')).toBeVisible();
		await expect(getAccountSettingsMenuItem(page)).toContainText('Account settings');

		await expect(getThemeMenuItem(page)).toBeVisible();
		await expect(getThemeMenuItem(page).locator('mat-icon')).toBeVisible();
		await expect(getThemeMenuItem(page)).toContainText('Primary/secondary mode');

		await expect(getLogoutMenuItem(page)).toBeVisible();
		await expect(getLogoutMenuItem(page).locator('mat-icon')).toBeVisible();
		await expect(getLogoutMenuItem(page)).toContainText('Log out');

		await expect(getLanguageMenuItem(page)).not.toBeVisible();
	});

	test('should theme changer work', async ({ page }) => {
		const initial = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(initial).toBeNull();

		await expect(getMoreActionsBtn(page)).toBeVisible();

		await getMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		const after1 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after1).toBe('secondary');
		await expect(getThemeMenuItem(page)).not.toBeVisible();

		await getMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		const after2 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after2).toBe('primary');
		await expect(getThemeMenuItem(page)).not.toBeVisible();
	});
});

test.describe('Sidebar — unauthenticated, mobile (<768px)', () => {
	test.use({ viewport: { width: 500, height: 700 } });

	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' });
		await page.addInitScript(() => {
			localStorage.setItem('language', 'en');
			localStorage.removeItem('themePreference');
		});
		await page.goto('/', { waitUntil: 'domcontentloaded' });
		if (await getErrorSnackbar(page).isVisible()) {
			await getSnackbarCloseBtn(page).click();
		}
	});

	test('should display bottom navbar instead of sidebar', async ({ page }) => {
		await expect(getMobileNavigation(page)).toBeVisible();
		await expect(getSidebar(page)).not.toBeVisible();
	});

	test('should show unauthenticated nav icons in mobile bar', async ({ page }) => {
		await expect(getMobileNavHomeBtn(page)).toBeVisible();
		await expect(getMobileNavHomeBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavHomeBtn(page)).toContainText('');

		await expect(getMobileNavLoginBtn(page)).toBeVisible();
		await expect(getMobileNavLoginBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavLoginBtn(page)).toContainText('');

		await expect(getMobileNavRegisterBtn(page)).toBeVisible();
		await expect(getMobileNavRegisterBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavRegisterBtn(page)).toContainText('');
	});

	test('should not display logo in mobile view', async ({ page }) => {
		await expect(getLogoHorizontal(page)).not.toBeVisible();
		await expect(getLogoCompact(page)).not.toBeVisible();
	});

	test('should show more_horiz button in mobile bar', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
	});

	test('should open menu with language and contrast items from mobile bar', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
		await getMobileMoreActionsBtn(page).click();

		await expect(getLanguageMenuItem(page)).toBeVisible();
		await expect(getLanguageMenuItem(page)).toContainText('Change language');

		await expect(getThemeMenuItem(page)).toBeVisible();
		await expect(getThemeMenuItem(page)).toContainText('Primary/secondary mode');

		await expect(getAccountSettingsMenuItem(page)).not.toBeVisible();

		await expect(getLogoutMenuItem(page)).not.toBeVisible();
	});

	test('should navigation buttons navigate to the correct pages and have active class', async ({ page }) => {
		await getMobileNavLoginBtn(page).click();
		await page.waitForURL('/public/login');
		await expect(getMobileNavLoginBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavHomeBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavRegisterBtn(page)).not.toHaveClass(/active/);

		await getMobileNavRegisterBtn(page).click();
		await page.waitForURL('/public/register');
		await expect(getMobileNavRegisterBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavHomeBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavLoginBtn(page)).not.toHaveClass(/active/);

		await getMobileNavHomeBtn(page).click();
		await page.waitForURL('/');
		await expect(getMobileNavHomeBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavLoginBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavRegisterBtn(page)).not.toHaveClass(/active/);
	});

	test('should change language via mobile menu', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
		await getMobileMoreActionsBtn(page).click();
		await expect(getLanguageMenuItem(page)).toBeVisible();
		await getLanguageMenuItem(page).click();

		const huOption = page.getByRole('menuitem', { name: /HU.*Magyar/i });
		await huOption.click();

		const lang = await page.evaluate(() => localStorage.getItem('language'));
		expect(lang).toBe('hu');
	});

	test('should toggle theme via mobile menu', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
		await getMobileMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		await expect(getThemeMenuItem(page)).not.toBeVisible();

		const after1 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after1).toBe('secondary');

		await getMobileMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		await expect(getThemeMenuItem(page)).not.toBeVisible();

		const after2 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after2).toBe('primary');
	});
});

test.describe('Sidebar — authenticated, mobile (<768px)', () => {
	test.use({ viewport: { width: 500, height: 700 } });

	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' });
		await page.addInitScript(() => {
			localStorage.setItem('language', 'en');
			localStorage.removeItem('themePreference');
		});
		await attemptLogin(page, 'user');
		await page.evaluate(() => localStorage.setItem('language', 'en'));
		await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
	});

	test('should display bottom navbar instead of sidebar', async ({ page }) => {
		await expect(getMobileNavigation(page)).toBeVisible();
		await expect(getSidebar(page)).not.toBeVisible();
	});

	test('should show authenticated nav icons in mobile bar', async ({ page }) => {
		await expect(getMobileNavDashboardBtn(page)).toBeVisible();
		await expect(getMobileNavDashboardBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavDashboardBtn(page)).toContainText('');

		await expect(getMobileNavTransactionsBtn(page)).toBeVisible();
		await expect(getMobileNavTransactionsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavTransactionsBtn(page)).toContainText('');

		await expect(getMobileNavStatisticsBtn(page)).toBeVisible();
		await expect(getMobileNavStatisticsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavStatisticsBtn(page)).toContainText('');

		await expect(getMobileNavGoalsBtn(page)).toBeVisible();
		await expect(getMobileNavGoalsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavGoalsBtn(page)).toContainText('');

		await expect(getMobileNavDebtsBtn(page)).toBeVisible();
		await expect(getMobileNavDebtsBtn(page).locator('mat-icon')).toBeVisible();
		await expect(getMobileNavDebtsBtn(page)).toContainText('');
	});

	test('should not display logo in mobile view', async ({ page }) => {
		await expect(getLogoHorizontal(page)).not.toBeVisible();
		await expect(getLogoCompact(page)).not.toBeVisible();
	});

	test('should show more_horiz button in mobile bar', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
	});

	test('should open menu with items from mobile bar', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
		await getMobileMoreActionsBtn(page).click();

		await expect(getThemeMenuItem(page)).toBeVisible();
		await expect(getThemeMenuItem(page)).toContainText('Primary/secondary mode');

		await expect(getAccountSettingsMenuItem(page)).toBeVisible();
		await expect(getAccountSettingsMenuItem(page)).toContainText('Account settings');

		await expect(getLogoutMenuItem(page)).toBeVisible();
		await expect(getLogoutMenuItem(page)).toContainText('Log out');

		await expect(getLanguageMenuItem(page)).not.toBeVisible();
	});

	test('should navigation buttons navigate to the correct pages and have active class', async ({ page }) => {
		await getMobileNavTransactionsBtn(page).click();
		await page.waitForURL('/transactions');
		await expect(getMobileNavTransactionsBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getMobileNavStatisticsBtn(page).click();
		await page.waitForURL('/statistics');
		await expect(getMobileNavStatisticsBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavDebtsBtn(page)).not.toHaveClass(/active/);

		await getMobileNavGoalsBtn(page).click();
		await page.waitForURL('/goals');
		await expect(getMobileNavGoalsBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavDashboardBtn(page)).not.toHaveClass(/active/);

		await getMobileNavDebtsBtn(page).click();
		await page.waitForURL('/debts');
		await expect(getMobileNavDebtsBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavDashboardBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavGoalsBtn(page)).not.toHaveClass(/active/);

		await getMobileNavDashboardBtn(page).click();
		await page.waitForURL('/dashboard');
		await expect(getMobileNavDashboardBtn(page)).toHaveClass(/active/);
		await expect(getMobileNavTransactionsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavStatisticsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavGoalsBtn(page)).not.toHaveClass(/active/);
		await expect(getMobileNavDebtsBtn(page)).not.toHaveClass(/active/);
	});

	test('should open profile dialog via mobile menu', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
		await getMobileMoreActionsBtn(page).click();
		await expect(getAccountSettingsMenuItem(page)).toBeVisible();
		await getAccountSettingsMenuItem(page).click();
		await expect(getProfileDialog(page)).toBeVisible();
	});

	test('should toggle theme via mobile menu', async ({ page }) => {
		await expect(getMobileMoreActionsBtn(page)).toBeVisible();
		await getMobileMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		await expect(getThemeMenuItem(page)).not.toBeVisible();

		const after1 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after1).toBe('secondary');

		await getMobileMoreActionsBtn(page).click();
		await expect(getThemeMenuItem(page)).toBeVisible();
		await getThemeMenuItem(page).click();
		await expect(getThemeMenuItem(page)).not.toBeVisible();

		const after2 = await page.evaluate(() => localStorage.getItem('themePreference'));
		expect(after2).toBe('primary');
	});
});
