import { expect, test } from '@playwright/test';
import { setupDashboard } from '../utils/setup-dashboard.utils';
import { getCategoriesCard } from '../../category/locators/categories-locators';
import {
	getDashboardSubtitle,
	getDashboardTitle,
	getCreateExpenseBtn,
	getCreateIncomeBtn,
	getExpensesList,
	getIncomeList,
	getSummaryBalance,
	getSummaryExpense,
	getSummaryIncome,
	getTimeframeChecked,
	getTimeframeSelector,
	getTransactionsList,
} from '../locators/dashboard-locators';
import { selectTimeframe, TimeframeOption } from '../utils/timeframe-utils';
import { waitForChartRequest } from '../utils/chart-request.utils';
import {
	assertListOpensDialogWithType,
	assertMobileButtonOpensDialog,
	assertTransactionDialogClosesOnCancel,
	createDefaultCategory,
	createExpenseInList,
	createExpenseViaMobileButton,
	createIncomeInList,
	createRecurringExpenseInList,
	createRecurringIncomeInList,
} from '../../transaction/utils/transaction-list.utils';
import {
	getFilterBadge,
	getFilterMenuBtn,
	getFilterTypeSelect,
} from '../../transactions/locators/transactions-locators';
import dashboardData from '../data/dashboard.data.json';
import authData from '../../auth/data/auth.data.json';

// General
test.describe('Dashboard - components', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDashboard(page, context);
	});

	test('should display title with username', async ({ page }) => {
		await expect(getDashboardTitle(page)).toBeVisible();
		await expect(getDashboardTitle(page)).toContainText('E2E Test User');
	});

	test('should display subtitle', async ({ page }) => {
		await expect(getDashboardSubtitle(page)).toBeVisible();
	});

	test('should display summary containers', async ({ page }) => {
		await expect(getSummaryIncome(page)).toBeVisible();
		await expect(getSummaryExpense(page)).toBeVisible();
		await expect(getSummaryBalance(page)).toBeVisible();
	});

	test('should display categories card', async ({ page }) => {
		await expect(getCategoriesCard(page)).toBeVisible();
	});

	test('should display chart timeframe selector', async ({ page }) => {
		await expect(getTimeframeSelector(page)).toBeVisible();
	});
});

// Layout
test.describe('Dashboard — layout', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupDashboard(page, context);
	});

	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test('should display separate expense and income transaction lists', async ({ page }) => {
			await expect(getExpensesList(page)).toBeVisible();
			await expect(getIncomeList(page)).toBeVisible();
			await expect(getTransactionsList(page)).not.toBeVisible();
		});

		test('should not display mobile create buttons', async ({ page }) => {
			await expect(getCreateExpenseBtn(page)).not.toBeVisible();
			await expect(getCreateIncomeBtn(page)).not.toBeVisible();
		});
	});

	test.describe('on small screens', () => {
		test.use({ viewport: { width: 900, height: 800 } });

		test('should display a single combined transaction list', async ({ page }) => {
			await expect(getTransactionsList(page)).toBeVisible();
			await expect(getExpensesList(page)).not.toBeVisible();
			await expect(getIncomeList(page)).not.toBeVisible();
		});

		test('should display mobile create buttons', async ({ page }) => {
			await expect(getCreateExpenseBtn(page)).toBeVisible();
			await expect(getCreateIncomeBtn(page)).toBeVisible();
		});
	});
});

// Summary container navigation
test.describe('Dashboard — summary container navigation', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDashboard(page, context);
	});

	test('should navigate on income summary container click', async ({ page }) => {
		await getSummaryIncome(page).click();
		await page.waitForURL(
			url =>
				url.pathname === '/transactions' &&
				url.searchParams.get('type') === dashboardData.transactionTypes.income,
		);

		await getFilterMenuBtn(page).click();
		await expect(getFilterTypeSelect(page)).toContainText(dashboardData.transactionTypes.income);
		await expect(getFilterBadge(page)).toContainText(dashboardData.filterBadgeCount);
	});

	test('should navigate on expense summary container click', async ({ page }) => {
		await getSummaryExpense(page).click();
		await page.waitForURL(
			url =>
				url.pathname === '/transactions' &&
				url.searchParams.get('type') === dashboardData.transactionTypes.expense,
		);

		await getFilterMenuBtn(page).click();
		await expect(getFilterTypeSelect(page)).toContainText(dashboardData.transactionTypes.expense);
		await expect(getFilterBadge(page)).toContainText(dashboardData.filterBadgeCount);
	});

	test('should navigate on balance summary container click', async ({ page }) => {
		await getSummaryBalance(page).click();
		await page.waitForURL(url => url.pathname === '/transactions' && !url.searchParams.has('type'));

		await expect(getFilterBadge(page)).not.toBeVisible();
	});
});

// Create transaction
test.describe('Dashboard — create transaction', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDashboard(page, context);
	});

	test('should open create transaction dialog from expenses list add button with expense type selected', async ({
		page,
	}) => {
		await assertListOpensDialogWithType(page, getExpensesList(page), dashboardData.transactionTypes.expense);
	});

	test('should open create transaction dialog from income list add button with income type selected', async ({
		page,
	}) => {
		await assertListOpensDialogWithType(page, getIncomeList(page), dashboardData.transactionTypes.income);
	});

	test('should close create transaction dialog on cancel', async ({ page }) => {
		await assertTransactionDialogClosesOnCancel(page, getExpensesList(page));
	});

	test('should create an expense and see it in the expenses list', async ({ page }) => {
		await createDefaultCategory(page);
		await createExpenseInList(page, getExpensesList(page));
	});

	test('should create an income and see it in the income list', async ({ page }) => {
		await createDefaultCategory(page, 'INCOME');
		await createIncomeInList(page, getIncomeList(page));
	});

	test('should create a recurring income and it should not appear in the income list', async ({ page }) => {
		await createDefaultCategory(page, 'INCOME');
		await createRecurringIncomeInList(page, getIncomeList(page));
	});

	test('should create a recurring expense and it should not appear in the expenses list', async ({ page }) => {
		await createDefaultCategory(page);
		await createRecurringExpenseInList(page, getExpensesList(page));
	});

	test.describe('Dashboard - create transaction via mobile buttons', () => {
		test.use({ viewport: { width: 500, height: 700 } });

		test('should open create expense dialog from mobile expense button', async ({ page }) => {
			await assertMobileButtonOpensDialog(page, getCreateExpenseBtn(page));
		});

		test('should open create income dialog from mobile income button', async ({ page }) => {
			await assertMobileButtonOpensDialog(page, getCreateIncomeBtn(page));
		});

		test('should create an expense and see it in the transaction list', async ({ page }) => {
			await createDefaultCategory(page);
			await createExpenseViaMobileButton(page, getCreateExpenseBtn(page), getTransactionsList(page));
		});
	});
});

// Chart timeframe
test.describe('Dashboard — chart timeframe', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDashboard(page, context);
	});

	test('should display all timeframe options', async ({ page }) => {
		for (const label of dashboardData.timeframeLabels) {
			await expect(getTimeframeSelector(page).getByText(label, { exact: true })).toBeVisible();
		}
	});

	test('should select 1W timeframe and send correct request', async ({ page }) => {
		const { label, param } = dashboardData.timeframes['ONE_WEEK'];
		const [request] = await Promise.all([
			waitForChartRequest(page, param),
			selectTimeframe(page, label as TimeframeOption),
		]);
		expect(new URL(request.url()).searchParams.get('timeframe')).toBe(param);
		await expect(getTimeframeChecked(page)).toContainText(label);
	});

	test('should select 1M timeframe and send correct request', async ({ page }) => {
		const { label, param } = dashboardData.timeframes['ONE_MONTH'];
		const [request] = await Promise.all([
			waitForChartRequest(page, param),
			selectTimeframe(page, label as TimeframeOption),
		]);
		expect(new URL(request.url()).searchParams.get('timeframe')).toBe(param);
		await expect(getTimeframeChecked(page)).toContainText(label);
	});

	test('should select 6M timeframe and send correct request', async ({ page }) => {
		const { label, param } = dashboardData.timeframes['SIX_MONTHS'];
		const [request] = await Promise.all([
			waitForChartRequest(page, param),
			selectTimeframe(page, label as TimeframeOption),
		]);
		expect(new URL(request.url()).searchParams.get('timeframe')).toBe(param);
		await expect(getTimeframeChecked(page)).toContainText(label);
	});

	test('should select YTD timeframe and send correct request', async ({ page }) => {
		const { label, param } = dashboardData.timeframes['YEAR_TO_DATE'];
		const [request] = await Promise.all([
			waitForChartRequest(page, param),
			selectTimeframe(page, label as TimeframeOption),
		]);
		expect(new URL(request.url()).searchParams.get('timeframe')).toBe(param);
		await expect(getTimeframeChecked(page)).toContainText(label);
	});

	test('should select 1Y timeframe and send correct request', async ({ page }) => {
		const { label, param } = dashboardData.timeframes['ONE_YEAR'];
		const [request] = await Promise.all([
			waitForChartRequest(page, param),
			selectTimeframe(page, label as TimeframeOption),
		]);
		expect(new URL(request.url()).searchParams.get('timeframe')).toBe(param);
		await expect(getTimeframeChecked(page)).toContainText(label);
	});

	test('should select All timeframe and send correct request', async ({ page }) => {
		const { label, param } = dashboardData.timeframes['ALL'];
		const [request] = await Promise.all([
			waitForChartRequest(page, param),
			selectTimeframe(page, label as TimeframeOption),
		]);
		expect(new URL(request.url()).searchParams.get('timeframe')).toBe(param);
		await expect(getTimeframeChecked(page)).toContainText(label);
	});
});
