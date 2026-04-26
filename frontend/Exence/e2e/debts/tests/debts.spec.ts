import test, { expect } from '@playwright/test';
import { addDays } from 'date-fns';
import { DebtType } from '../../../src/app/data-model/modules/debt/DebtType';
import { createUniqueName, fillAndBlur, formatDateForInput } from '../../form/utils/form-utils';
import { getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import { setShowBaseCurrency } from '../../workspace-settings/utils/workspace-settings.utils';
import debtData from '../data/debts.data.json';
import {
	getCreateDebtDialog,
	getDebtCancelBtn,
	getDebtCategorySearchClearBtn,
	getDebtCategorySelect,
	getDebtConfirmExitCancelBtn,
	getDebtConfirmExitContinueBtn,
	getDebtConfirmExitDialog,
	getDebtCounterpartyClearBtn,
	getDebtCounterpartyInput,
	getDebtCreateBtnInner,
	getDebtDeadlineInput,
	getDebtDialogCloseBtn,
	getDebtOriginalAmountInput,
	getDebtPayBtnInner,
	getDebtPaymentAmountInput,
	getDebtSaveBtn,
	getDebtSaveBtnInner,
	getDebtStatusOption,
	getDebtStatusSelect,
	getDebtTitleClearBtn,
	getDebtTitleInput,
	getDebtTypeSelect,
	getEditDebtCancelBtn,
	getEditDebtDialog,
	getEditDebtDialogCloseBtn,
	getFirstCategoryOption,
} from '../locators/debts-dialog-locators';
import {
	getDebtBaseCurrency,
	getDebtBorrowedList,
	getDebtBorrowedListAddBtn,
	getDebtBorrowedListRows,
	getDebtCounterparty,
	getDebtDaysHeader,
	getDebtDeadline,
	getDebtDeleteAction,
	getDebtEditAction,
	getDebtExpandedDetails,
	getDebtLentList,
	getDebtLentListAddBtn,
	getDebtLentListRows,
	getDebtListRows,
	getDebtListsContainer,
	getDebtLoggedCurrency,
	getDebtMenuTrigger,
	getDebtOriginalAmount,
	getDebtProgressBar,
	getDebtsEmptyCreateBtn,
	getDebtsEmptyState,
	getDebtStatCards,
	getDebtStatusIndicator,
} from '../locators/debts-locators';
import {
	createDebt,
	deleteAllDebts,
	openCreateBorrowDialog,
	openCreateLendDialog,
	openEditBorrowDialog,
	openEditDialogForSpecificRow,
	openEditLendDialog,
} from '../utils/create-debt.utils';
import {
	setupDebtsEmpty,
	setupDebtsWithBorrowed,
	setupDebtsWithBothLists,
	setupDebtsWithLent,
} from '../utils/setup-debts.utils';

// Empty state
test.describe('Debts - empty state', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsEmpty(page, context);
	});

	test('should display empty state when no debts exist', async ({ page }) => {
		await expect(getDebtsEmptyState(page)).toBeVisible();
	});

	test('should display create button on empty state', async ({ page }) => {
		await expect(getDebtsEmptyCreateBtn(page)).toBeVisible();
	});

	test('should open create debt dialog from empty state button', async ({ page }) => {
		await getDebtsEmptyCreateBtn(page).click();
		await expect(getCreateDebtDialog(page)).toBeVisible();
	});
});

// Create via empty state button
test.describe('Debts - create goal via empty state button', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsEmpty(page, context);
	});

	test('should create a borrow via the empty state create button and display it in the list while other list empty', async ({
		page,
	}) => {
		await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.BORROWED });
		await expect(getDebtBorrowedListRows(page)).toHaveCount(1);
		await expect(getDebtLentList(page)).toBeVisible();
		await expect(getDebtLentListRows(page)).toHaveCount(0);
		await deleteAllDebts(page);
	});

	test('should create a lent via the empty state create button and display it in the list while other list empty', async ({
		page,
	}) => {
		await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.LENT });
		await expect(getDebtLentListRows(page)).toHaveCount(1);
		await expect(getDebtBorrowedList(page)).toBeVisible();
		await expect(getDebtBorrowedListRows(page)).toHaveCount(0);
		await deleteAllDebts(page);
	});
});

// Overview with data (xl)
test.describe('Debts - overview with data (xl)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBothLists(page, context);
	});

	test('should display stat cards section', async ({ page }) => {
		await expect(getDebtStatCards(page)).toBeVisible();
		await deleteAllDebts(page);
	});

	test('should not have horizontally scrollable stat cards', async ({ page }) => {
		const isScrollable = await getDebtStatCards(page).evaluate(el => el.scrollWidth > el.clientWidth);
		expect(isScrollable).toBe(false);
		await deleteAllDebts(page);
	});

	test('should display separate lists in a row next to each other', async ({ page }) => {
		await expect(getDebtListsContainer(page)).toHaveCSS('flex-direction', 'row');
		await deleteAllDebts(page);
	});

	test('should display at least one debt the lent list', async ({ page }) => {
		await expect(getDebtLentListRows(page).first()).toBeVisible();
		await deleteAllDebts(page);
	});

	test('should display at least one debt the borrowed list', async ({ page }) => {
		await expect(getDebtBorrowedListRows(page).first()).toBeVisible();
		await deleteAllDebts(page);
	});
});

// Overview with data (mobile)
test.describe('Debts - overview with data (mobile)', () => {
	test.use({ viewport: { width: 700, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBothLists(page, context);
	});

	test('should display stat cards section', async ({ page }) => {
		await expect(getDebtStatCards(page)).toBeVisible();
		await deleteAllDebts(page);
	});

	test('should have horizontally scrollable stat cards', async ({ page }) => {
		const isScrollable = await getDebtStatCards(page).evaluate(el => el.scrollWidth > el.clientWidth);
		expect(isScrollable).toBe(true);
		await deleteAllDebts(page);
	});

	test('should display separate lists in a column under each other', async ({ page }) => {
		await expect(getDebtListsContainer(page)).toHaveCSS('flex-direction', 'column');
		await deleteAllDebts(page);
	});

	test('should display at least one debt the lent list', async ({ page }) => {
		await expect(getDebtLentListRows(page).first()).toBeVisible();
		await deleteAllDebts(page);
	});

	test('should display at least one debt the borrowed list', async ({ page }) => {
		await expect(getDebtBorrowedListRows(page).first()).toBeVisible();
		await deleteAllDebts(page);
	});
});

// List - status indicator
test.describe('Debts list - status indicator', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
	});

	test('should show a status indicator for every list row', async ({ page }) => {
		await createDebt(page, getDebtBorrowedListAddBtn(page));
		await createDebt(page, getDebtBorrowedListAddBtn(page));
		const rows = getDebtBorrowedListRows(page);
		const count = await rows.count();
		expect(count).toBeGreaterThan(0);
		for (let i = 0; i < count; i++) {
			await expect(getDebtStatusIndicator(rows.nth(i))).toBeVisible();
		}
		await deleteAllDebts(page);
	});

	test('should apply correct attribute for ACTIVE status', async ({ page }) => {
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.BORROWED });
		await openEditBorrowDialog(page);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.active).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtBorrowedListRows(page).first().click();

		const activeRow = getDebtBorrowedListRows(page).first();
		const indicator = getDebtStatusIndicator(activeRow);
		await expect(indicator).toHaveAttribute('status', debtData.statuses.active);
		const bgColor = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(bgColor).not.toBe('transparent');
		await deleteAllDebts(page);
	});

	test('should apply correct attribute for SETTLED status', async ({ page }) => {
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.BORROWED });
		await openEditBorrowDialog(page);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.settled).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtBorrowedListRows(page).first().click();

		const activeRow = getDebtBorrowedListRows(page).first();
		const indicator = getDebtStatusIndicator(activeRow);
		await expect(indicator).toHaveAttribute('status', debtData.statuses.settled);
		const bgColor = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(bgColor).not.toBe('transparent');
		await deleteAllDebts(page);
	});

	test('should apply correct attribute for EXPIRED status', async ({ page }) => {
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.BORROWED });
		await openEditBorrowDialog(page);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.expired).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtBorrowedListRows(page).first().click();

		const activeRow = getDebtBorrowedListRows(page).first();
		const indicator = getDebtStatusIndicator(activeRow);
		await expect(indicator).toHaveAttribute('status', debtData.statuses.expired);
		const bgColor = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(bgColor).not.toBe('transparent');
		await deleteAllDebts(page);
	});

	test('should apply correct attribute for FORGIVEN status', async ({ page }) => {
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.BORROWED });
		await openEditBorrowDialog(page);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.forgiven).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtBorrowedListRows(page).first().click();

		const activeRow = getDebtBorrowedListRows(page).first();
		const indicator = getDebtStatusIndicator(activeRow);
		await expect(indicator).toHaveAttribute('status', debtData.statuses.forgiven);
		const bgColor = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(bgColor).not.toBe('transparent');
		await deleteAllDebts(page);
	});

	test('should all statuses have correct attribute and different color', async ({ page }) => {
		const ts = createUniqueName();
		const activeTitle = `a-${ts}`;
		const settledTitle = `s-${ts}`;
		const expiredTitle = `e-${ts}`;
		const forgivenTitle = `f-${ts}`;

		await createDebt(page, getDebtsEmptyCreateBtn(page), { title: activeTitle, type: DebtType.BORROWED });
		await createDebt(page, getDebtBorrowedListAddBtn(page), { title: settledTitle, type: DebtType.BORROWED });
		await createDebt(page, getDebtBorrowedListAddBtn(page), { title: expiredTitle, type: DebtType.BORROWED });
		await createDebt(page, getDebtBorrowedListAddBtn(page), { title: forgivenTitle, type: DebtType.BORROWED });

		const activeRow = getDebtBorrowedListRows(page).filter({ has: page.getByText(activeTitle, { exact: true }) });
		const settledRow = getDebtBorrowedListRows(page).filter({ has: page.getByText(settledTitle, { exact: true }) });
		const expiredRow = getDebtBorrowedListRows(page).filter({ has: page.getByText(expiredTitle, { exact: true }) });
		const forgivenRow = getDebtBorrowedListRows(page).filter({
			has: page.getByText(forgivenTitle, { exact: true }),
		});

		// Set debt to active
		await openEditDialogForSpecificRow(page, activeRow);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.active).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();

		// Set debt to settled
		await openEditDialogForSpecificRow(page, settledRow);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.settled).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();

		// Set debt to expired
		await openEditDialogForSpecificRow(page, expiredRow);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.expired).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();

		// Set debt to forgiven
		await openEditDialogForSpecificRow(page, forgivenRow);
		await getDebtStatusSelect(page).click();
		await getDebtStatusOption(page, debtData.statuses.forgiven).click();
		await getDebtSaveBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();

		const activeIndicator = getDebtStatusIndicator(activeRow);
		const settledIndicator = getDebtStatusIndicator(settledRow);
		const expiredIndicator = getDebtStatusIndicator(expiredRow);
		const forgivenIndicator = getDebtStatusIndicator(forgivenRow);

		await expect(activeIndicator).toHaveAttribute('status', debtData.statuses.active);
		await expect(settledIndicator).toHaveAttribute('status', debtData.statuses.settled);
		await expect(expiredIndicator).toHaveAttribute('status', debtData.statuses.expired);
		await expect(forgivenIndicator).toHaveAttribute('status', debtData.statuses.forgiven);

		const activeColor = await activeIndicator.evaluate(el => getComputedStyle(el).backgroundColor);
		const settledColor = await settledIndicator.evaluate(el => getComputedStyle(el).backgroundColor);
		const expiredColor = await expiredIndicator.evaluate(el => getComputedStyle(el).backgroundColor);
		const forgivenColor = await forgivenIndicator.evaluate(el => getComputedStyle(el).backgroundColor);

		// Active color different
		expect(activeColor).not.toBe(settledColor);
		expect(activeColor).not.toBe(expiredColor);
		expect(activeColor).not.toBe(forgivenColor);

		// Settled color different
		expect(settledColor).not.toBe(activeColor);
		expect(settledColor).not.toBe(expiredColor);
		expect(settledColor).not.toBe(forgivenColor);

		// Expired color different
		expect(expiredColor).not.toBe(activeColor);
		expect(expiredColor).not.toBe(settledColor);
		expect(expiredColor).not.toBe(forgivenColor);

		// Forgiven color different
		expect(forgivenColor).not.toBe(activeColor);
		expect(forgivenColor).not.toBe(settledColor);
		expect(forgivenColor).not.toBe(expiredColor);
		await deleteAllDebts(page);
	});
});

// List - Borrow - responsive columns
test.describe('Debts list - Borrow - responsive columns', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
	});

	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test('should display the days column in borrowed list', async ({ page }) => {
			await expect(getDebtDaysHeader(page)).toBeVisible();
			await deleteAllDebts(page);
		});
	});

	test.describe('on small screens (below 768px)', () => {
		test.use({ viewport: { width: 500, height: 700 } });

		test('should hide the days column in borrowed list', async ({ page }) => {
			await expect(getDebtDaysHeader(page)).not.toBeVisible();
			await deleteAllDebts(page);
		});
	});
});

// List - Lent - responsive columns
test.describe('Debts list - Lent - responsive columns', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithLent(page, context);
	});

	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test('should display the days column in lent list', async ({ page }) => {
			await expect(getDebtDaysHeader(page)).toBeVisible();
			await deleteAllDebts(page);
		});
	});

	test.describe('on small screens (below 768px)', () => {
		test.use({ viewport: { width: 500, height: 700 } });

		test('should hide the days column in lent list', async ({ page }) => {
			await expect(getDebtDaysHeader(page)).not.toBeVisible();
			await deleteAllDebts(page);
		});
	});
});

// List - expand rows
test.describe('Debts list - expand rows', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
	});

	test('should expand row on click and show details', async ({ page }) => {
		const firstRow = getDebtBorrowedListRows(page).first();
		await firstRow.click();
		await expect(getDebtExpandedDetails(page).first()).toBeVisible();
		await firstRow.click();
		await deleteAllDebts(page);
	});

	test('should show progress bar in expanded section', async ({ page }) => {
		await getDebtBorrowedListRows(page).first().click();
		await expect(getDebtProgressBar(page)).toBeVisible();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show counterparty section in expanded details', async ({ page }) => {
		await getDebtBorrowedListRows(page).first().click();
		await expect(getDebtCounterparty(page)).toBeVisible();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show original amount section in expanded details', async ({ page }) => {
		await getDebtBorrowedListRows(page).first().click();
		await expect(getDebtOriginalAmount(page)).toBeVisible();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show deadline section in expanded details', async ({ page }) => {
		await getDebtBorrowedListRows(page).first().click();
		await expect(getDebtDeadline(page)).toBeVisible();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should collapse row on second click', async ({ page }) => {
		const firstRow = getDebtBorrowedListRows(page).first();
		await firstRow.click();
		await expect(getDebtExpandedDetails(page)).toBeVisible();
		await firstRow.click();
		await expect(getDebtExpandedDetails(page)).toBeVisible();
		await deleteAllDebts(page);
	});

	test('should show base currency info in expanded row when debt currency differs and showBaseCurrency is OFF', async ({
		page,
	}) => {
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), {
			title: 'USD Debt BaseCurrency',
			originalAmount: 1000000,
			currency: 'USD',
			deadline: addDays(new Date(), 30),
			type: DebtType.BORROWED,
		});
		await setShowBaseCurrency(page, false);
		await page.goto('/debts', { waitUntil: 'domcontentloaded' });
		getDebtBorrowedListRows(page).first().click();
		await expect(getDebtBaseCurrency(page)).toBeVisible();
		getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show logged currency info in expanded row when showBaseCurrency is ON', async ({ page }) => {
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), {
			title: 'USD Debt LoggedCurrency',
			type: DebtType.BORROWED,
		});
		await setShowBaseCurrency(page, true);
		await page.goto('/debts', { waitUntil: 'domcontentloaded' });
		getDebtBorrowedListRows(page).first().click();
		await expect(getDebtLoggedCurrency(page)).toBeVisible();
		getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
		await setShowBaseCurrency(page, false);
	});
});

// List - Borrowed - add button
test.describe('Debts list - Borrowed - add button', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
	});

	test('should open create goal dialog when clicking the add button', async ({ page }) => {
		await getDebtBorrowedListAddBtn(page).click();
		await expect(getCreateDebtDialog(page)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});
});

// List - Lent - add button
test.describe('Debts list - Lent - add button', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithLent(page, context);
	});

	test('should open create goal dialog when clicking the add button', async ({ page }) => {
		await getDebtLentListAddBtn(page).click();
		await expect(getCreateDebtDialog(page)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});
});

// List - Borrowed - row actions
test.describe('Debts list - Borrowed - row actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
	});

	test('should open edit dialog on edit action click', async ({ page }) => {
		const firstRow = getDebtBorrowedListRows(page).first();
		await firstRow.click();
		await getDebtMenuTrigger(firstRow).click();
		await getDebtEditAction(page).click();
		await expect(getEditDebtDialog(page)).toBeVisible();
		await getEditDebtCancelBtn(page).click();
		await firstRow.click();
		await deleteAllDebts(page);
	});

	test('should remove goal from list on delete action click', async ({ page }) => {
		const countBefore = await getDebtBorrowedListRows(page).count();
		const firstRow = getDebtBorrowedListRows(page).first();
		await firstRow.click();
		await getDebtMenuTrigger(firstRow).click();
		await getDebtDeleteAction(page).click();
		await expect(getDebtBorrowedListRows(page)).toHaveCount(countBefore - 1);
	});
});

// List - Lent - row actions
test.describe('Debts list - Lent - row actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithLent(page, context);
	});

	test('should open edit dialog on edit action click', async ({ page }) => {
		const firstRow = getDebtLentListRows(page).first();
		await firstRow.click();
		await getDebtMenuTrigger(firstRow).click();
		await getDebtEditAction(page).click();
		await expect(getEditDebtDialog(page)).toBeVisible();
		await getEditDebtCancelBtn(page).click();
		await firstRow.click();
		await deleteAllDebts(page);
	});

	test('should remove goal from list on delete action click', async ({ page }) => {
		const countBefore = await getDebtLentListRows(page).count();
		const firstRow = getDebtLentListRows(page).first();
		await firstRow.click();
		await getDebtMenuTrigger(firstRow).click();
		await getDebtDeleteAction(page).click();
		await expect(getDebtLentListRows(page)).toHaveCount(countBefore - 1);
	});
});

// Create dialog - structure - Borrowed
test.describe('Create debt dialog - structure - Borrowed', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openCreateBorrowDialog(page);
	});

	test('should display create goal dialog after clicking add button', async ({ page }) => {
		await expect(getCreateDebtDialog(page)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should have create button disabled on init', async ({ page }) => {
		await expect(getDebtCreateBtnInner(page)).toBeDisabled();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should have cancel button visible', async ({ page }) => {
		await expect(getDebtCancelBtn(page)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});
});

// Create dialog - structure - Lent
test.describe('Create debt dialog - structure - Lent', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithLent(page, context);
		await openCreateBorrowDialog(page);
	});

	test('should display create goal dialog after clicking add button', async ({ page }) => {
		await expect(getCreateDebtDialog(page)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should have create button disabled on init', async ({ page }) => {
		await expect(getDebtCreateBtnInner(page)).toBeDisabled();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should have cancel button visible', async ({ page }) => {
		await expect(getDebtCancelBtn(page)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});
});

// Create dialog - validators
test.describe('Create debt dialog - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openCreateBorrowDialog(page);
	});

	test('should show required error on title', async ({ page }) => {
		await getDebtTitleInput(page).click();
		await getDebtTitleInput(page).blur();
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show maxLength error on title when exceeding 255 chars', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'a'.repeat(debtData.validation.maxTitleLength + 1));
		await expect(page.getByText(debtData.errors.maxLength, { exact: false })).toBeVisible();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show required error on counterpartyName', async ({ page }) => {
		await getDebtCounterpartyInput(page).click();
		await getDebtCounterpartyInput(page).blur();
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show maxLength error on counterpartyName when exceeding 255 chars', async ({ page }) => {
		await fillAndBlur(getDebtCounterpartyInput(page), 'a'.repeat(debtData.validation.maxCounterpartyLength + 1));
		await expect(page.getByText(debtData.errors.maxLength, { exact: false })).toBeVisible();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show required error on originalAmount', async ({ page }) => {
		await getDebtOriginalAmountInput(page).fill('');
		await getDebtOriginalAmountInput(page).blur();
		await page.waitForTimeout(100);
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show min error on originalAmount when set to 0', async ({ page }) => {
		await getDebtOriginalAmountInput(page).fill('0');
		await getDebtOriginalAmountInput(page).blur();
		await expect(page.getByText(debtData.errors.minValue, { exact: false })).toBeVisible();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show required error on category', async ({ page }) => {
		await getDebtCategorySelect(page).click();
		await page.keyboard.press('Escape');
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});
});

// Create dialog - clear buttons
test.describe('Create debt dialog - clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openCreateBorrowDialog(page);
	});

	test('should clear title via clear button', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Some Title');
		await getDebtTitleClearBtn(page).click();
		await expect(getDebtTitleInput(page)).toHaveValue('');
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should clear counterpartyName via clear button', async ({ page }) => {
		await fillAndBlur(getDebtCounterpartyInput(page), 'Some Person');
		await getDebtCounterpartyClearBtn(page).click();
		await expect(getDebtCounterpartyInput(page)).toHaveValue('');
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should clear category search text via clear button', async ({ page }) => {
		await getDebtCategorySelect(page).click();
		const searchInput = page.locator('.search-with-select input');
		await fillAndBlur(searchInput, 'search text');
		await getDebtCategorySearchClearBtn(page).click();
		await expect(searchInput).toHaveValue('');
		await page.keyboard.press('Escape');
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});
});

// Create dialog - unsaved changes guard
test.describe('Create goal dialog - unsaved changes guard', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openCreateBorrowDialog(page);
	});

	test('should close confirm exit dialog when cancel button is clicked with pristine form', async ({ page }) => {
		await getDebtCancelBtn(page).click();
		await expect(getDebtConfirmExitDialog(page)).not.toBeVisible();
		await deleteAllDebts(page);
	});

	test('should show confirm exit dialog when cancel button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Unsaved Title');
		await getDebtCancelBtn(page).click();
		await expect(getDebtConfirmExitDialog(page)).toBeVisible();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should keep create dialog open when confirm exit cancel is clicked', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Unsaved Title');
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitCancelBtn(page).click();
		await expect(getCreateDebtDialog(page)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).last().click();
		await deleteAllDebts(page);
	});

	test('should close create dialog when confirm exit continue is clicked', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Unsaved Title');
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await expect(getCreateDebtDialog(page)).not.toBeVisible();
		await deleteAllDebts(page);
	});

	test('should close dialog when X button is clicked with pristine form', async ({ page }) => {
		await getDebtDialogCloseBtn(page).click();
		await expect(getDebtConfirmExitDialog(page)).not.toBeVisible();
		await deleteAllDebts(page);
	});

	test('should show confirm exit dialog when X button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Unsaved Title');
		await getDebtDialogCloseBtn(page).click();
		await expect(getDebtConfirmExitDialog(page)).toBeVisible();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should close dialog when clicking outside the dialog with pristine form', async ({ page }) => {
		await page.mouse.click(0, 0);
		await expect(getDebtConfirmExitDialog(page)).not.toBeVisible();
		await deleteAllDebts(page);
	});

	test('should show confirm exit dialog when clicking outside the dialog with dirty form', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Unsaved Title');
		await page.mouse.click(0, 0);
		await expect(getDebtConfirmExitDialog(page)).toBeVisible();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});
});

// Create dialog - Borrowed - submit and cancel
test.describe('Create debt dialog - Borrowed - submit and cancel', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
	});

	test('should create new debt and increase list count by 1', async ({ page }) => {
		const countBefore = await getDebtBorrowedListRows(page).count();
		await openCreateBorrowDialog(page);

		await fillAndBlur(getDebtTitleInput(page), 'New E2E Debt');
		await getDebtOriginalAmountInput(page).fill('50000');
		await getDebtOriginalAmountInput(page).blur();
		await getDebtCounterpartyInput(page).fill('Counterparty');
		await getDebtCounterpartyInput(page).blur();
		await fillAndBlur(getDebtDeadlineInput(page), formatDateForInput(addDays(new Date(), 30)));
		await getDebtCategorySelect(page).click();
		await getFirstCategoryOption(page).click();
		await getDebtCreateBtnInner(page).click();

		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getDebtBorrowedListRows(page)).toHaveCount(countBefore + 1);
		await deleteAllDebts(page);
	});

	test('should close dialog on cancel without dirty changes', async ({ page }) => {
		await openCreateBorrowDialog(page);
		await getDebtCancelBtn(page).click();
		await expect(getCreateDebtDialog(page)).not.toBeVisible();
		await deleteAllDebts(page);
	});
});

// Create dialog - Lent - submit and cancel
test.describe('Create debt dialog - Lent - submit and cancel', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithLent(page, context);
	});

	test('should create new debt and increase list count by 1', async ({ page }) => {
		const countBefore = await getDebtLentListRows(page).count();
		await openCreateLendDialog(page);

		await fillAndBlur(getDebtTitleInput(page), 'New E2E Debt');
		await getDebtOriginalAmountInput(page).fill('50000');
		await getDebtOriginalAmountInput(page).blur();
		await getDebtCounterpartyInput(page).fill('Counterparty');
		await getDebtCounterpartyInput(page).blur();
		await fillAndBlur(getDebtDeadlineInput(page), formatDateForInput(addDays(new Date(), 30)));
		await getDebtCategorySelect(page).click();
		await getFirstCategoryOption(page).click();
		await getDebtCreateBtnInner(page).click();

		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getDebtLentListRows(page)).toHaveCount(countBefore + 1);
		await deleteAllDebts(page);
	});

	test('should close dialog on cancel without dirty changes', async ({ page }) => {
		await openCreateLendDialog(page);
		await getDebtCancelBtn(page).click();
		await expect(getCreateDebtDialog(page)).not.toBeVisible();
		await deleteAllDebts(page);
	});
});

// Edit dialog - Borrowed - prefill
test.describe('Edit goal dialog - Borrowed - prefill', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openEditBorrowDialog(page);
	});

	test('should prefill title', async ({ page }) => {
		await expect(getDebtTitleInput(page)).toHaveValue(debtData.createDebt.title);
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should prefill counterpartyName', async ({ page }) => {
		await expect(getDebtCounterpartyInput(page)).toHaveValue(debtData.createDebt.counterpartyName);
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should prefill deadline', async ({ page }) => {
		await expect(getDebtDeadlineInput(page)).toHaveValue('');
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should prefill type', async ({ page }) => {
		await expect(getDebtTypeSelect(page)).toContainText(debtData.typeOption.borrowed);
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should prefill status', async ({ page }) => {
		await expect(getDebtStatusSelect(page)).toContainText(debtData.statusOption.active);
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should prefill category', async ({ page }) => {
		await expect(getDebtCategorySelect(page)).not.toHaveText('');
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});
});

// Edit dialog - validators
test.describe('Edit debt dialog - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openCreateBorrowDialog(page);
	});

	test('should show required error on title clear', async ({ page }) => {
		await getDebtTitleInput(page).click();
		await getDebtTitleInput(page).blur();
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show maxLength error on title when exceeding 255 chars', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'a'.repeat(debtData.validation.maxTitleLength + 1));
		await expect(page.getByText(debtData.errors.maxLength, { exact: false })).toBeVisible();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show required error on counterpartyName', async ({ page }) => {
		await getDebtCounterpartyInput(page).click();
		await getDebtCounterpartyInput(page).blur();
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show maxLength error on counterpartyName when exceeding 255 chars', async ({ page }) => {
		await fillAndBlur(getDebtCounterpartyInput(page), 'a'.repeat(debtData.validation.maxCounterpartyLength + 1));
		await expect(page.getByText(debtData.errors.maxLength, { exact: false })).toBeVisible();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await deleteAllDebts(page);
	});

	test('should show required error on category', async ({ page }) => {
		await getDebtCategorySelect(page).click();
		await page.keyboard.press('Escape');
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getDebtCancelBtn(page).click();
		await deleteAllDebts(page);
	});
});

// Edit dialog - unsaved changes guard
test.describe('Edit debt dialog - unsaved changes guard', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openEditBorrowDialog(page);
	});

	test('should NOT show confirm exit dialog when form is pristine and X is clicked', async ({ page }) => {
		await getEditDebtDialogCloseBtn(page).click();
		await expect(getDebtConfirmExitDialog(page)).not.toBeVisible();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show confirm exit dialog when title is dirty and cancel is clicked', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Dirty Title');
		await getEditDebtCancelBtn(page).click();
		await expect(getDebtConfirmExitDialog(page)).toBeVisible();
		await getDebtConfirmExitContinueBtn(page).click();
		await getDebtListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should keep edit dialog open when confirm exit cancel is clicked', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Dirty Title');
		await getEditDebtCancelBtn(page).click();
		await expect(getEditDebtDialog(page)).toBeVisible();
		await getDebtConfirmExitCancelBtn(page).click();
		await getEditDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).last().click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should close edit dialog when confirm exit continue is clicked', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Dirty Title');
		await getEditDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show confirm exit dialog when X button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Dirty Title');
		await getEditDebtDialogCloseBtn(page).click();
		await expect(getDebtConfirmExitDialog(page)).toBeVisible();
		await getDebtConfirmExitContinueBtn(page).click();
		await getDebtListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show confirm exit dialog when clicking outside the dialog with dirty form', async ({ page }) => {
		await fillAndBlur(getDebtTitleInput(page), 'Dirty Title');
		await page.mouse.click(0, 0);
		await expect(getDebtConfirmExitDialog(page)).toBeVisible();
		await getDebtConfirmExitContinueBtn(page).click();
		await getDebtListRows(page).first().click();
		await deleteAllDebts(page);
	});
});

// Edit dialog - Borrowed - submit
test.describe('Edit debt dialog - Borrowed - submit', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openEditBorrowDialog(page);
	});

	test('should create button be disabled when title is updated to an invalid one', async ({ page }) => {
		const newTitle = 'a'.repeat(debtData.validation.maxTitleLength + 1);
		await fillAndBlur(getDebtTitleInput(page), newTitle);
		await expect(getDebtSaveBtnInner(page)).toBeDisabled();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await getDebtListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should update debt title and see change in the list', async ({ page }) => {
		const newTitle = debtData.editDebt.newTitle;
		await fillAndBlur(getDebtTitleInput(page), newTitle);
		await getDebtSaveBtnInner(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getDebtBorrowedListRows(page).filter({ hasText: newTitle })).toBeVisible();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should close edit dialog on cancel without changes', async ({ page }) => {
		await getEditDebtCancelBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});
});

// Edit dialog - Lent - submit
test.describe('Edit debt dialog - Lent - submit', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithLent(page, context);
		await openEditLendDialog(page);
	});

	test('should create button be disabled when title is updated to an invalid one', async ({ page }) => {
		const newTitle = 'a'.repeat(debtData.validation.maxTitleLength + 1);
		await fillAndBlur(getDebtTitleInput(page), newTitle);
		await expect(getDebtSaveBtnInner(page)).toBeDisabled();
		await getDebtCancelBtn(page).click();
		await getDebtConfirmExitContinueBtn(page).click();
		await getDebtListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should update debt title and see change in the list', async ({ page }) => {
		const newTitle = debtData.editDebt.newTitle;
		await fillAndBlur(getDebtTitleInput(page), newTitle);
		await getDebtSaveBtnInner(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getDebtLentListRows(page).filter({ hasText: newTitle })).toBeVisible();
		await getDebtLentListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should close edit dialog on cancel without changes', async ({ page }) => {
		await getEditDebtCancelBtn(page).click();
		await expect(getEditDebtDialog(page)).not.toBeVisible();
		await getDebtLentListRows(page).first().click();
		await deleteAllDebts(page);
	});
});

// Edit dialog - Borrowed - pay
test.describe('Edit debt dialog - Borrowed - pay', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupDebtsWithBorrowed(page, context);
		await openEditBorrowDialog(page);
	});

	test('should show amount stepper and pay button disabled in edit dialog', async ({ page }) => {
		await expect(getDebtPaymentAmountInput(page)).toBeVisible();
		await expect(getDebtPayBtnInner(page)).toBeDisabled();
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should show required validator for payment amount', async ({ page }) => {
		await getDebtPaymentAmountInput(page).fill('');
		await getDebtPaymentAmountInput(page).blur();
		await expect(page.getByText(debtData.errors.required)).toBeVisible();
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should pay button not be disabled when amount stepper has value', async ({ page }) => {
		await expect(getDebtPayBtnInner(page)).toBeDisabled();
		await getDebtPaymentAmountInput(page).fill('100');
		await expect(getDebtPayBtnInner(page)).not.toBeDisabled();
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should add pay amount on button click and change status when target reached', async ({ page }) => {
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), {
			title: 'test pay debt',
			type: DebtType.BORROWED,
			originalAmount: 200,
		});
		const createdRow = getDebtBorrowedListRows(page).first();
		const createdRowIndicatorColor = getDebtStatusIndicator(createdRow).evaluate(
			el => getComputedStyle(el).backgroundColor,
		);
		await openEditBorrowDialog(page);
		await getDebtPaymentAmountInput(page).fill('100');
		await getDebtPayBtnInner(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await openEditBorrowDialog(page);
		await getDebtPaymentAmountInput(page).fill('100');
		await getDebtPayBtnInner(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		const updatedRow = getDebtBorrowedListRows(page).first();
		const updatedRowIndicatorColor = getDebtStatusIndicator(updatedRow).evaluate(
			el => getComputedStyle(el).backgroundColor,
		);
		expect(createdRowIndicatorColor).not.toBe(updatedRowIndicatorColor);
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
	});

	test('should pay button and payment amount be disabled when ', async ({ page }) => {
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();
		await deleteAllDebts(page);
		await createDebt(page, getDebtsEmptyCreateBtn(page), {
			title: 'test pay debt',
			type: DebtType.BORROWED,
			originalAmount: 100,
		});
		await openEditBorrowDialog(page);
		await getDebtPaymentAmountInput(page).fill('100');
		await getDebtPayBtnInner(page).click();
		await getDebtBorrowedListRows(page).first().click();

		await openEditBorrowDialog(page);
		await expect(getDebtPaymentAmountInput(page)).toBeDisabled();
		await expect(getDebtPayBtnInner(page)).toBeDisabled();
		await getEditDebtCancelBtn(page).click();
		await getDebtBorrowedListRows(page).first().click();

		await deleteAllDebts(page);
	});
});
