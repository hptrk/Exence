import { expect, test } from '@playwright/test';
import { addDays, subDays } from 'date-fns';
import { createUniqueName, fillAndBlur, formatDateForInput } from '../../form/utils/form-utils';
import { getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import { setShowBaseCurrency } from '../../workspace-settings/utils/workspace-settings.utils';
import goalsData from '../data/goals.data.json';
import {
	getCalendar,
	getCalendarDisabledCells,
	getCalendarEnabledCells,
	getCategorySearchClearBtn,
	getCreateGoalDialog,
	getEditGoalCancelBtn,
	getEditGoalDialog,
	getEditGoalDialogCloseBtn,
	getFirstCategoryOption,
	getGoalCancelBtn,
	getGoalCategorySelect,
	getGoalConfirmExitCancelBtn,
	getGoalConfirmExitContinueBtn,
	getGoalConfirmExitDialog,
	getGoalCreateBtnInner,
	getGoalCurrentAmountInput,
	getGoalDeadlineInput,
	getGoalDescriptionInput,
	getGoalDialogCloseBtn,
	getGoalInitialAmountInput,
	getGoalSaveBtnInner,
	getGoalStatusSelect,
	getGoalTargetAmountInput,
	getGoalTitleClearBtn,
	getGoalTitleInput,
	getStatusOption,
} from '../locators/goals-dialog-locators';
import {
	getGoalChartGrid,
	getGoalDeadlineHeader,
	getGoalDeleteAction,
	getGoalEditAction,
	getGoalExpandedDetails,
	getGoalListAddBtn,
	getGoalListRows,
	getGoalMenuTrigger,
	getGoalProgressBar,
	getGoalProgressTrendSelect,
	getGoalStatCards,
	getGoalStatusIndicator,
	getGoalsEmptyCreateBtn,
	getGoalsEmptyState,
} from '../locators/goals-locators';
import {
	createExpiredGoal,
	createGoal,
	deleteAllGoals,
	openCreateDialog,
	openEditDialog,
} from '../utils/create-goal.utils';
import { setupGoals, setupGoalsEmpty } from '../utils/setup-goals.utils';

// Empty state
test.describe('Goals - empty state', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoalsEmpty(page, context);
	});

	test('should display empty state when no goals exist', async ({ page }) => {
		await expect(getGoalsEmptyState(page)).toBeVisible();
	});

	test('should display create button on empty state', async ({ page }) => {
		await expect(getGoalsEmptyCreateBtn(page)).toBeVisible();
	});

	test('should open create goal dialog from empty state button', async ({ page }) => {
		await getGoalsEmptyCreateBtn(page).click();
		await expect(getCreateGoalDialog(page)).toBeVisible();
	});
});

// Create via empty state button
test.describe('Goals - create goal via empty state button', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoalsEmpty(page, context);
	});

	test('should create a goal via the empty state create button and display it in the list', async ({ page }) => {
		await createGoal(page, getGoalsEmptyCreateBtn(page));
		await expect(getGoalListRows(page)).toHaveCount(1);
		await deleteAllGoals(page);
	});
});

// Overview with data
test.describe('Goals - overview with data', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
	});

	test('should display stat cards section', async ({ page }) => {
		await expect(getGoalStatCards(page)).toBeVisible();
		await deleteAllGoals(page);
	});

	test('should display chart grid section', async ({ page }) => {
		await expect(getGoalChartGrid(page)).toBeVisible();
		await deleteAllGoals(page);
	});

	test('should have horizontally scrollable stat cards', async ({ page }) => {
		const isScrollable = await getGoalStatCards(page).evaluate(el => el.scrollWidth > el.clientWidth);
		expect(isScrollable).toBe(true);
		await deleteAllGoals(page);
	});

	test('should display at least one goal in the list', async ({ page }) => {
		await expect(getGoalListRows(page).first()).toBeVisible();
		await deleteAllGoals(page);
	});
});

// Progress trend chart
test.describe('Goals - progress trend chart goal selector', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await createGoal(page, getGoalListAddBtn(page));
	});

	test('should send request to server when selecting a different goal in the progress trend chart', async ({
		page,
	}) => {
		const select = getGoalProgressTrendSelect(page);
		await expect(select).toBeVisible();
		const [request] = await Promise.all([
			page.waitForRequest(req => req.url().includes(goalsData.api.goalProgressTrend)),
			select.click().then(async () => {
				await page.locator('mat-option').nth(1).click();
			}),
		]);
		expect(new URL(request.url()).pathname).toContain('GOAL_PROGRESS_TREND');
		await deleteAllGoals(page);
	});
});

// List - status indicator
test.describe('Goals list - status indicator', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
	});

	test('should show a status indicator for every list row', async ({ page }) => {
		await createGoal(page, getGoalListAddBtn(page));
		await createGoal(page, getGoalListAddBtn(page));
		const rows = getGoalListRows(page);
		const count = await rows.count();
		expect(count).toBeGreaterThan(0);
		for (let i = 0; i < count; i++) {
			await expect(getGoalStatusIndicator(rows.nth(i))).toBeVisible();
		}
		await deleteAllGoals(page);
	});

	test('should apply correct attribute for ACTIVE status', async ({ page }) => {
		const title = createUniqueName();
		await createGoal(page, getGoalListAddBtn(page), { title });
		const activeRow = getGoalListRows(page).filter({ has: page.getByText(title, { exact: true }) });
		const indicator = getGoalStatusIndicator(activeRow);
		await expect(indicator).toHaveAttribute('status', goalsData.statuses.active);
		const bgColor = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(bgColor).not.toBe('transparent');
		await deleteAllGoals(page);
	});

	test('should apply correct attribute for COMPLETED status and different color from ACTIVE', async ({ page }) => {
		const ts = createUniqueName();
		const activeTitle = `a-${ts}`;
		const completedTitle = `c-${ts}`;
		await createGoal(page, getGoalListAddBtn(page), {
			title: activeTitle,
			targetAmount: 10000,
			initialAmount: 0,
		});
		await createGoal(page, getGoalListAddBtn(page), {
			title: completedTitle,
			targetAmount: 10000,
			initialAmount: 10000,
		});

		const activeRow = getGoalListRows(page).filter({ has: page.getByText(activeTitle, { exact: true }) });
		const completedRow = getGoalListRows(page).filter({ has: page.getByText(completedTitle, { exact: true }) });

		const activeIndicator = getGoalStatusIndicator(activeRow);
		const completedIndicator = getGoalStatusIndicator(completedRow);

		await expect(completedIndicator).toHaveAttribute('status', goalsData.statuses.completed);
		const activeColor = await activeIndicator.evaluate(el => getComputedStyle(el).backgroundColor);
		const completedColor = await completedIndicator.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(activeColor).not.toBe(completedColor);
		await deleteAllGoals(page);
	});

	test('should apply correct attribute for EXPIRED status', async ({ page }) => {
		const title = createUniqueName();
		await createExpiredGoal(page, title);
		await page.goto('/goals', { waitUntil: 'domcontentloaded' });

		const expiredRow = getGoalListRows(page).filter({ has: page.getByText(title, { exact: true }) });
		const indicator = getGoalStatusIndicator(expiredRow);
		await expect(indicator).toHaveAttribute('status', goalsData.statuses.expired);
		const bgColor = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
		await deleteAllGoals(page);
	});

	test('should apply different colors for each status', async ({ page }) => {
		const ts = createUniqueName();
		const activeTitle = `a-${ts}`;
		const completedTitle = `c-${ts}`;
		const expiredTitle = `e-${ts}`;
		await createGoal(page, getGoalListAddBtn(page), {
			title: activeTitle,
			targetAmount: 100000,
			deadline: addDays(new Date(), 30),
		});
		await createGoal(page, getGoalListAddBtn(page), {
			title: completedTitle,
			targetAmount: 100000,
			initialAmount: 100000,
			deadline: addDays(new Date(), 30),
		});
		await createExpiredGoal(page, expiredTitle);
		await page.goto('/goals', { waitUntil: 'domcontentloaded' });

		const activeColor = await getGoalStatusIndicator(
			getGoalListRows(page).filter({ has: page.getByText(activeTitle, { exact: true }) }),
		).evaluate(el => getComputedStyle(el).backgroundColor);
		const completedColor = await getGoalStatusIndicator(
			getGoalListRows(page).filter({ has: page.getByText(completedTitle, { exact: true }) }),
		).evaluate(el => getComputedStyle(el).backgroundColor);
		const expiredColor = await getGoalStatusIndicator(
			getGoalListRows(page).filter({ has: page.getByText(expiredTitle, { exact: true }) }),
		).evaluate(el => getComputedStyle(el).backgroundColor);

		expect(activeColor).not.toBe(completedColor);
		expect(activeColor).not.toBe(expiredColor);
		expect(completedColor).not.toBe(expiredColor);
		await deleteAllGoals(page);
	});
});

// List - responsive columns
test.describe('Goals list - responsive columns', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
	});

	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test('should display the deadline column', async ({ page }) => {
			await expect(getGoalDeadlineHeader(page)).toBeVisible();
			await deleteAllGoals(page);
		});
	});

	test.describe('on small screens (below 768px)', () => {
		test.use({ viewport: { width: 500, height: 700 } });

		test('should hide the deadline column', async ({ page }) => {
			await expect(getGoalDeadlineHeader(page)).not.toBeVisible();
			await deleteAllGoals(page);
		});
	});
});

// List - expand rows
test.describe('Goals list - expand rows', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
	});

	test('should expand row on click and show details', async ({ page }) => {
		const firstRow = getGoalListRows(page).first();
		await firstRow.click();
		await expect(getGoalExpandedDetails(page).first()).toBeVisible();
		await firstRow.click();
		await deleteAllGoals(page);
	});

	test('should show progress bar in expanded section', async ({ page }) => {
		await getGoalListRows(page).first().click();
		await expect(getGoalProgressBar(page)).toBeVisible();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show note section in expanded details', async ({ page }) => {
		await getGoalListRows(page).first().click();
		await expect(page.getByText(goalsData.labels.note).first()).toBeVisible();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show status section in expanded details', async ({ page }) => {
		await getGoalListRows(page).first().click();
		await expect(page.getByText(goalsData.labels.status).first()).toBeVisible();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should collapse row on second click', async ({ page }) => {
		const firstRow = getGoalListRows(page).first();
		await firstRow.click();
		const detailContainer = page.locator('.detail-container').first();
		await expect(detailContainer).toBeVisible();
		await firstRow.click();
		await expect(detailContainer).not.toBeVisible();
		await deleteAllGoals(page);
	});

	test('should show base currency info in expanded row when goal currency differs and showBaseCurrency is OFF', async ({
		page,
	}) => {
		await deleteAllGoals(page);
		await createGoal(page, getGoalsEmptyCreateBtn(page), {
			title: 'USD Goal BaseCurrency',
			targetAmount: 1000000,
			currency: 'USD',
			deadline: addDays(new Date(), 30),
		});
		await setShowBaseCurrency(page, false);
		await page.goto('/goals', { waitUntil: 'domcontentloaded' });
		getGoalListRows(page).first().click();
		await expect(page.getByText(goalsData.labels.baseCurrency).first()).toBeVisible();
		getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show logged currency info in expanded row when showBaseCurrency is ON', async ({ page }) => {
		await deleteAllGoals(page);
		await createGoal(page, getGoalsEmptyCreateBtn(page), { title: 'USD Goal LoggedCurrency' });
		await setShowBaseCurrency(page, true);
		await page.goto('/goals', { waitUntil: 'domcontentloaded' });
		getGoalListRows(page).first().click();
		await expect(page.getByText(goalsData.labels.loggedCurrency).first()).toBeVisible();
		getGoalListRows(page).first().click();
		await deleteAllGoals(page);
		await setShowBaseCurrency(page, false);
	});
});

// List - add button
test.describe('Goals list - add button', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
	});

	test('should open create goal dialog when clicking the add button', async ({ page }) => {
		await getGoalListAddBtn(page).click();
		await expect(getCreateGoalDialog(page)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});
});

// List - row actions
test.describe('Goals list - row actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
	});

	test('should open edit dialog on edit action click', async ({ page }) => {
		const firstRow = getGoalListRows(page).first();
		await firstRow.click();
		await getGoalMenuTrigger(firstRow).click();
		await getGoalEditAction(page).click();
		await expect(getEditGoalDialog(page)).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await firstRow.click();
		await deleteAllGoals(page);
	});

	test('should remove goal from list on delete action click', async ({ page }) => {
		const countBefore = await getGoalListRows(page).count();
		const firstRow = getGoalListRows(page).first();
		await firstRow.click();
		await getGoalMenuTrigger(firstRow).click();
		await getGoalDeleteAction(page).click();
		await expect(getGoalListRows(page)).toHaveCount(countBefore - 1);
	});
});

// Create dialog - structure
test.describe('Create goal dialog - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await openCreateDialog(page);
	});

	test('should display create goal dialog after clicking add button', async ({ page }) => {
		await expect(getCreateGoalDialog(page)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should have create button disabled on init', async ({ page }) => {
		await expect(getGoalCreateBtnInner(page)).toBeDisabled();
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should have cancel button visible', async ({ page }) => {
		await expect(getGoalCancelBtn(page)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});
});

// Create dialog - validators
test.describe('Create goal dialog - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await openCreateDialog(page);
	});

	test('should show required error on title', async ({ page }) => {
		await getGoalTitleInput(page).click();
		await getGoalTitleInput(page).blur();
		await expect(page.getByText(goalsData.errors.required)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should show maxLength error on title when exceeding 255 chars', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'a'.repeat(goalsData.validation.maxTitleLength + 1));
		await expect(page.getByText(goalsData.errors.maxLength, { exact: false })).toBeVisible();
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should show min error on targetAmount when set to 0', async ({ page }) => {
		await getGoalTargetAmountInput(page).fill('0');
		await getGoalTargetAmountInput(page).blur();
		await expect(page.getByText(goalsData.errors.minValue, { exact: false })).toBeVisible();
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should show form-level error when initialAmount exceeds targetAmount', async ({ page }) => {
		await getGoalTargetAmountInput(page).fill('100');
		await getGoalTargetAmountInput(page).blur();
		await getGoalInitialAmountInput(page).fill('200');
		await getGoalInitialAmountInput(page).blur();
		await expect(page.getByText(goalsData.errors.initialAmountMax)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should show required error on deadline', async ({ page }) => {
		await getGoalDeadlineInput(page).click();
		await getGoalDeadlineInput(page).blur();
		await expect(page.getByText(goalsData.errors.required)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should show required error on category', async ({ page }) => {
		await getGoalCategorySelect(page).click();
		await page.keyboard.press('Escape');
		await expect(page.getByText(goalsData.errors.required)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should show maxLength error on description when exceeding 500 chars', async ({ page }) => {
		await fillAndBlur(getGoalDescriptionInput(page), 'a'.repeat(goalsData.validation.maxDescriptionLength + 1));
		await expect(page.getByText(goalsData.errors.maxLength, { exact: false })).toBeVisible();
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should disable past dates in the deadline datepicker', async ({ page }) => {
		await page.locator('mat-datepicker-toggle').click();
		await expect(getCalendar(page)).toBeVisible();
		const disabledCells = getCalendarDisabledCells(page);
		await expect(disabledCells.first()).toBeVisible();
		getCalendarEnabledCells(page).first().click();
		await expect(getCalendar(page)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});
});

// Create dialog - clear buttons
test.describe('Create goal dialog - clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await openCreateDialog(page);
	});

	test('should clear title via clear button', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Some Title');
		await getGoalTitleClearBtn(page).click();
		await expect(getGoalTitleInput(page)).toHaveValue('');
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should clear category search text via clear button', async ({ page }) => {
		await getGoalCategorySelect(page).click();
		const searchInput = page.locator('.search-with-select input');
		await fillAndBlur(searchInput, 'search text');
		await getCategorySearchClearBtn(page).click();
		await expect(searchInput).toHaveValue('');
		await page.keyboard.press('Escape');
		await getGoalCancelBtn(page).click();
		await deleteAllGoals(page);
	});
});

// Create dialog - unsaved changes guard
test.describe('Create goal dialog - unsaved changes guard', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await openCreateDialog(page);
	});

	test('should close confirm exit dialog when cancel button is clicked with pristine form', async ({ page }) => {
		await getGoalCancelBtn(page).click();
		await expect(getGoalConfirmExitDialog(page)).not.toBeVisible();
		await deleteAllGoals(page);
	});

	test('should show confirm exit dialog when cancel button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Unsaved Title');
		await getGoalCancelBtn(page).click();
		await expect(getGoalConfirmExitDialog(page)).toBeVisible();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should keep create dialog open when confirm exit cancel is clicked', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Unsaved Title');
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitCancelBtn(page).click();
		await expect(getCreateGoalDialog(page)).toBeVisible();
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).last().click();
		await deleteAllGoals(page);
	});

	test('should close create dialog when confirm exit continue is clicked', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Unsaved Title');
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await expect(getCreateGoalDialog(page)).not.toBeVisible();
		await deleteAllGoals(page);
	});

	test('should close dialog when X button is clicked with pristine form', async ({ page }) => {
		await getGoalDialogCloseBtn(page).click();
		await expect(getGoalConfirmExitDialog(page)).not.toBeVisible();
		await deleteAllGoals(page);
	});

	test('should show confirm exit dialog when X button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Unsaved Title');
		await getGoalDialogCloseBtn(page).click();
		await expect(getGoalConfirmExitDialog(page)).toBeVisible();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});

	test('should close dialog when clicking outside the dialog with pristine form', async ({ page }) => {
		await page.mouse.click(0, 0);
		await expect(getGoalConfirmExitDialog(page)).not.toBeVisible();
		await deleteAllGoals(page);
	});

	test('should show confirm exit dialog when clicking outside the dialog with dirty form', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Unsaved Title');
		await page.mouse.click(0, 0);
		await expect(getGoalConfirmExitDialog(page)).toBeVisible();
		await getGoalConfirmExitContinueBtn(page).click();
		await deleteAllGoals(page);
	});
});

// Create dialog - submit and cancel
test.describe('Create goal dialog - submit and cancel', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
	});

	test('should create new goal and increase list count by 1', async ({ page }) => {
		const countBefore = await getGoalListRows(page).count();
		await openCreateDialog(page);

		await fillAndBlur(getGoalTitleInput(page), 'New E2E Goal');
		await getGoalTargetAmountInput(page).fill('50000');
		await getGoalTargetAmountInput(page).blur();
		await fillAndBlur(getGoalDeadlineInput(page), formatDateForInput(addDays(new Date(), 30)));
		await getGoalCategorySelect(page).click();
		await getFirstCategoryOption(page).click();
		await getGoalCreateBtnInner(page).click();

		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getGoalListRows(page)).toHaveCount(countBefore + 1);
		await deleteAllGoals(page);
	});

	test('should close dialog on cancel without dirty changes', async ({ page }) => {
		await openCreateDialog(page);
		await getGoalCancelBtn(page).click();
		await expect(getCreateGoalDialog(page)).not.toBeVisible();
		await deleteAllGoals(page);
	});
});

// Edit dialog - prefill
test.describe('Edit goal dialog - prefill', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	const goalTitle = 'Prefill Test Goal';
	const goalDescription = 'A prefill description';

	test.beforeEach(async ({ page, context }) => {
		await setupGoalsEmpty(page, context);
		await createGoal(page, getGoalsEmptyCreateBtn(page), {
			title: goalTitle,
			targetAmount: 50000,
			deadline: addDays(new Date(), 30),
			description: goalDescription,
		});
		const row = getGoalListRows(page).filter({ hasText: goalTitle });
		await row.click();
		await getGoalMenuTrigger(row).click();
		await getGoalEditAction(page).click();
		await expect(getEditGoalDialog(page)).toBeVisible();
	});

	test('should prefill title', async ({ page }) => {
		await expect(getGoalTitleInput(page)).toHaveValue(goalTitle);
		await getEditGoalCancelBtn(page).click();
		const row = getGoalListRows(page).filter({ hasText: goalTitle });
		await row.click();
		await deleteAllGoals(page);
	});

	test('should prefill target amount', async ({ page }) => {
		await expect(getGoalTargetAmountInput(page)).toHaveValue('50000');
		await getEditGoalCancelBtn(page).click();
		const row = getGoalListRows(page).filter({ hasText: goalTitle });
		await row.click();
		await deleteAllGoals(page);
	});

	test('should prefill description', async ({ page }) => {
		await expect(getGoalDescriptionInput(page)).toHaveValue(goalDescription);
		await getEditGoalCancelBtn(page).click();
		const row = getGoalListRows(page).filter({ hasText: goalTitle });
		await row.click();
		await deleteAllGoals(page);
	});

	test('should prefill status', async ({ page }) => {
		await expect(getGoalStatusSelect(page)).toContainText(goalsData.statuses.active);
		await getEditGoalCancelBtn(page).click();
		const row = getGoalListRows(page).filter({ hasText: goalTitle });
		await row.click();
		await deleteAllGoals(page);
	});

	test('should prefill category', async ({ page }) => {
		await expect(getGoalCategorySelect(page)).not.toHaveText('');
		await getEditGoalCancelBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});
});

// Edit dialog - validators
test.describe('Edit goal dialog - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await openEditDialog(page);
	});

	test('should show required error on title clear', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), '');
		await expect(page.getByText(goalsData.errors.required)).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show maxLength error on title when exceeding 255 chars', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'a'.repeat(goalsData.validation.maxTitleLength + 1));
		await expect(page.getByText(goalsData.errors.maxLength, { exact: false })).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show min error on targetAmount when set to 0', async ({ page }) => {
		await getGoalTargetAmountInput(page).fill('0');
		await getGoalTargetAmountInput(page).blur();
		await expect(page.getByText(goalsData.errors.minValue, { exact: false })).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show form-level error when currentAmount exceeds targetAmount', async ({ page }) => {
		await getGoalTargetAmountInput(page).fill('100');
		await getGoalTargetAmountInput(page).blur();
		await getGoalCurrentAmountInput(page).fill('200');
		await getGoalCurrentAmountInput(page).blur();
		await expect(page.getByText(goalsData.errors.fieldNotLessThan)).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show required error on deadline clear', async ({ page }) => {
		await getGoalDeadlineInput(page).fill('');
		await getGoalDeadlineInput(page).blur();
		await expect(page.getByText(goalsData.errors.required)).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show maxLength error on description when exceeding 500 chars', async ({ page }) => {
		await fillAndBlur(getGoalDescriptionInput(page), 'a'.repeat(goalsData.validation.maxDescriptionLength + 1));
		await expect(page.getByText(goalsData.errors.maxLength, { exact: false })).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});
});

// Edit dialog - unsaved changes guard
test.describe('Edit goal dialog - unsaved changes guard', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await openEditDialog(page);
	});

	test('should NOT show confirm exit dialog when form is pristine and X is clicked', async ({ page }) => {
		await getEditGoalDialogCloseBtn(page).click();
		await expect(getGoalConfirmExitDialog(page)).not.toBeVisible();
		await expect(getEditGoalDialog(page)).not.toBeVisible();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show confirm exit dialog when title is dirty and cancel is clicked', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Dirty Title');
		await getEditGoalCancelBtn(page).click();
		await expect(getGoalConfirmExitDialog(page)).toBeVisible();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should keep edit dialog open when confirm exit cancel is clicked', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Dirty Title');
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitCancelBtn(page).click();
		await expect(getEditGoalDialog(page)).toBeVisible();
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should close edit dialog when confirm exit continue is clicked', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Dirty Title');
		await getEditGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await expect(getEditGoalDialog(page)).not.toBeVisible();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show confirm exit dialog when X button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Dirty Title');
		await getEditGoalDialogCloseBtn(page).click();
		await expect(getGoalConfirmExitDialog(page)).toBeVisible();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should show confirm exit dialog when clicking outside the dialog with dirty form', async ({ page }) => {
		await fillAndBlur(getGoalTitleInput(page), 'Dirty Title');
		await page.mouse.click(0, 0);
		await expect(getGoalConfirmExitDialog(page)).toBeVisible();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});
});

// Edit dialog - submit
test.describe('Edit goal dialog - submit', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupGoals(page, context);
		await openEditDialog(page);
	});

	test('should create button be disabled when title is updated to an invalid one', async ({ page }) => {
		const newTitle = 'a'.repeat(goalsData.validation.maxTitleLength + 1);
		await fillAndBlur(getGoalTitleInput(page), newTitle);
		await expect(getGoalSaveBtnInner(page)).toBeDisabled();
		await getGoalCancelBtn(page).click();
		await getGoalConfirmExitContinueBtn(page).click();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should update goal title and see change in the list', async ({ page }) => {
		const newTitle = goalsData.editGoal.newTitle;
		await fillAndBlur(getGoalTitleInput(page), newTitle);
		await getGoalSaveBtnInner(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getGoalListRows(page).filter({ hasText: newTitle })).toBeVisible();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});

	test('should close edit dialog on cancel without changes', async ({ page }) => {
		await getEditGoalCancelBtn(page).click();
		await expect(getEditGoalDialog(page)).not.toBeVisible();
		await getGoalListRows(page).first().click();
		await deleteAllGoals(page);
	});
});

// Edit dialog - status changes via currentAmount
test.describe('Edit goal dialog - status changes via currentAmount', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test('should set status to COMPLETED when currentAmount equals targetAmount', async ({ page, context }) => {
		await setupGoalsEmpty(page, context);
		await createGoal(page, getGoalsEmptyCreateBtn(page), {
			title: 'Status Complete Goal',
			targetAmount: 10000,
			deadline: addDays(new Date(), 30),
		});
		await page.goto('/goals', { waitUntil: 'domcontentloaded' });

		const row = getGoalListRows(page).filter({ hasText: 'Status Complete Goal' });
		await row.click();
		await getGoalMenuTrigger(row).click();
		await getGoalEditAction(page).click();
		await expect(getEditGoalDialog(page)).toBeVisible();

		await getGoalCurrentAmountInput(page).fill('10000');
		await getGoalCurrentAmountInput(page).blur();
		await getGoalSaveBtnInner(page).click();

		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(
			getGoalStatusIndicator(getGoalListRows(page).filter({ hasText: 'Status Complete Goal' })),
		).toHaveAttribute('status', goalsData.statuses.completed);
		await row.click();
		await deleteAllGoals(page);
	});

	test('should set status to ACTIVE when currentAmount < targetAmount and deadline is future', async ({
		page,
		context,
	}) => {
		await setupGoalsEmpty(page, context);
		await createGoal(page, getGoalsEmptyCreateBtn(page), {
			title: 'Status Active Goal',
			targetAmount: 10000,
			initialAmount: 10000,
			deadline: addDays(new Date(), 30),
		});
		await page.goto('/goals', { waitUntil: 'domcontentloaded' });

		const row = getGoalListRows(page).filter({ hasText: 'Status Active Goal' });
		await row.click();
		await getGoalMenuTrigger(row).click();
		await getGoalEditAction(page).click();
		await expect(getEditGoalDialog(page)).toBeVisible();

		await getGoalCurrentAmountInput(page).fill('5000');
		await getGoalCurrentAmountInput(page).blur();
		await fillAndBlur(getGoalDeadlineInput(page), formatDateForInput(addDays(new Date(), 60)));
		await getGoalStatusSelect(page).click();
		await getStatusOption(page, goalsData.statuses.active).click();
		await getGoalSaveBtnInner(page).click();

		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(
			getGoalStatusIndicator(getGoalListRows(page).filter({ hasText: 'Status Active Goal' })),
		).toHaveAttribute('status', goalsData.statuses.active);
		await row.click();
		await deleteAllGoals(page);
	});

	test('should set status to EXPIRED when currentAmount < targetAmount and deadline is past', async ({
		page,
		context,
	}) => {
		await setupGoalsEmpty(page, context);
		await createGoal(page, getGoalsEmptyCreateBtn(page), {
			title: 'Status Expired Goal',
			targetAmount: 10000,
			deadline: addDays(new Date(), 30),
		});
		await page.goto('/goals', { waitUntil: 'domcontentloaded' });

		const row = getGoalListRows(page).filter({ hasText: 'Status Expired Goal' });
		await row.click();
		await getGoalMenuTrigger(row).click();
		await getGoalEditAction(page).click();
		await expect(getEditGoalDialog(page)).toBeVisible();

		await getGoalCurrentAmountInput(page).fill('5000');
		await getGoalCurrentAmountInput(page).blur();
		await fillAndBlur(getGoalDeadlineInput(page), formatDateForInput(subDays(new Date(), 1)));
		await getGoalStatusSelect(page).click();
		await getStatusOption(page, goalsData.statuses.expired).click();
		await getGoalSaveBtnInner(page).click();

		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(
			getGoalStatusIndicator(getGoalListRows(page).filter({ hasText: 'Status Expired Goal' })),
		).toHaveAttribute('status', goalsData.statuses.expired);
		await row.click();
		await deleteAllGoals(page);
	});
});
