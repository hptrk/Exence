import { expect, test } from '@playwright/test';
import { addDays } from 'date-fns';
import { fillAndBlur, formatDateForInput } from '../../form/utils/form-utils';
import { getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import investmentsData from '../data/investments.data.json';
import {
	getCreateInvestmentDialog,
	getCreateInvestmentDialogCloseBtn,
	getCreateInvestmentDialogTitle,
	getEditInvestmentCancelBtn,
	getEditInvestmentDialog,
	getEditInvestmentDialogCloseBtn,
	getInvestmentAmountInput,
	getInvestmentAssetAutocompleteOptions,
	getInvestmentAssetClearBtn,
	getInvestmentAssetInput,
	getInvestmentCancelBtn,
	getInvestmentConfirmExitCancelBtn,
	getInvestmentConfirmExitContinueBtn,
	getInvestmentConfirmExitDialog,
	getInvestmentCreateBtnInner,
	getInvestmentNoteClearBtn,
	getInvestmentNoteInput,
	getInvestmentPurchaseDateInput,
	getInvestmentSaveBtnInner,
	getInvestmentTypeSelect,
} from '../locators/investments-dialog-locators';
import {
	getInvestmentAddPurchaseAction,
	getInvestmentExpandedDetailAmount,
	getInvestmentExpandedDetailDate,
	getInvestmentExpandedDetailNote,
	getInvestmentExpandedDetails,
	getInvestmentExpandedDetailType,
	getInvestmentLastActionHeader,
	getInvestmentListAddBtn,
	getInvestmentListRows,
	getInvestmentMenuTrigger,
	getInvestmentPurchaseAmounts,
	getInvestmentPurchaseDeleteBtns,
	getInvestmentPurchaseEditBtns,
	getInvestmentsEmptyCreateBtn,
	getInvestmentsEmptyState,
	getInvestmentStatCards,
} from '../locators/investments-locators';
import { createInvestment, deleteAllInvestments, openEditDialog } from '../utils/create-investment.utils';
import { setupInvestments, setupInvestmentsEmpty } from '../utils/setup-investments.utils';

test.describe('Investments - empty state', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
	});

	test('should display empty state when no goals exist', async ({ page }) => {
		await expect(getInvestmentsEmptyState(page)).toBeVisible();
	});

	test('should display create button on empty state', async ({ page }) => {
		await expect(getInvestmentsEmptyCreateBtn(page)).toBeVisible();
	});

	test('should open create goal dialog from empty state button', async ({ page }) => {
		await getInvestmentsEmptyCreateBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
	});
});

// Create via empty state button
test.describe('Investments - create investment via empty state button', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
	});

	test('should create a goal via the empty state create button and display it in the list', async ({ page }) => {
		await createInvestment(page, getInvestmentsEmptyCreateBtn(page));
		await expect(getInvestmentListRows(page)).toHaveCount(1);
		await deleteAllInvestments(page);
	});
});

// Overview with data (xl)
test.describe('Investments - overview with data (xl)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
	});

	test('should display stat cards section', async ({ page }) => {
		await expect(getInvestmentStatCards(page)).toBeVisible();
		await deleteAllInvestments(page);
	});

	test('should have horizontally scrollable stat cards', async ({ page }) => {
		const isScrollable = await getInvestmentStatCards(page).evaluate(el => el.scrollWidth > el.clientWidth);
		expect(isScrollable).toBe(false);
		await deleteAllInvestments(page);
	});

	test('should display at least one investment in the list', async ({ page }) => {
		await expect(getInvestmentListRows(page).first()).toBeVisible();
		await deleteAllInvestments(page);
	});
});

// Overview with data (mobile)
test.describe('Investments - overview with data (mobile)', () => {
	test.use({ viewport: { width: 700, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
	});

	test('should display stat cards section', async ({ page }) => {
		await expect(getInvestmentStatCards(page)).toBeVisible();
		await deleteAllInvestments(page);
	});

	test('should have horizontally scrollable stat cards', async ({ page }) => {
		const isScrollable = await getInvestmentStatCards(page).evaluate(el => el.scrollWidth > el.clientWidth);
		expect(isScrollable).toBe(true);
		await deleteAllInvestments(page);
	});

	test('should display at least one investment in the list', async ({ page }) => {
		await expect(getInvestmentListRows(page).first()).toBeVisible();
		await deleteAllInvestments(page);
	});
});

// Create dialog - structure
test.describe('Create investment dialog - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
		await getInvestmentsEmptyCreateBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
	});

	test('should display create investment dialog', async ({ page }) => {
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
		await getInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should have create button disabled on init', async ({ page }) => {
		await expect(getInvestmentCreateBtnInner(page)).toBeDisabled();
		await getInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should have cancel button visible', async ({ page }) => {
		await expect(getInvestmentCancelBtn(page)).toBeVisible();
		await getInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should display the "New Asset" title', async ({ page }) => {
		await expect(getCreateInvestmentDialogTitle(page)).toContainText(investmentsData.dialogs.newAssetTitle);
		await getInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should type should be disabled when asset name is changed to an autofilled one', async ({ page }) => {
		await getInvestmentCancelBtn(page).click();
		await createInvestment(page, getInvestmentsEmptyCreateBtn(page), { asset: 'asset1' });
		await getInvestmentListAddBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
		await expect(getInvestmentTypeSelect(page)).toHaveText('');
		await expect(getInvestmentTypeSelect(page)).toBeEnabled();
		await getInvestmentAssetInput(page).click();
		await getInvestmentAssetAutocompleteOptions(page).filter({ hasText: 'asset1' }).click();
		await expect(getInvestmentTypeSelect(page)).not.toHaveText('');
		await expect(getInvestmentTypeSelect(page)).toBeDisabled();
		await getInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).last().click();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});
});

// List - responsive columns
test.describe('Investments list - responsive columns', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
	});

	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test('should display the last action column', async ({ page }) => {
			await expect(getInvestmentLastActionHeader(page)).toBeVisible();
			await deleteAllInvestments(page);
		});
	});

	test.describe('on small screens (below 768px)', () => {
		test.use({ viewport: { width: 500, height: 700 } });

		test('should hide the last action column', async ({ page }) => {
			await expect(getInvestmentLastActionHeader(page)).not.toBeVisible();
			await deleteAllInvestments(page);
		});
	});
});

// List - expand rows
test.describe('Investments list - expand rows', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
	});

	test('should expand row on click and show details', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).toBeVisible();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});

	test('should show note section in expanded details', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).toBeVisible();
		await expect(getInvestmentExpandedDetailNote(page)).toBeVisible();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});

	test('should show amount in expanded details', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).toBeVisible();
		await expect(getInvestmentExpandedDetailAmount(page)).toBeVisible();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});

	test('should show date in expanded details', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).toBeVisible();
		await expect(getInvestmentExpandedDetailDate(page)).toBeVisible();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});

	test('should show type in expanded details', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).toBeVisible();
		await expect(getInvestmentExpandedDetailType(page)).toBeVisible();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});

	test('should show action buttons in expanded details', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).toBeVisible();
		await expect(getInvestmentPurchaseEditBtns(page).first()).toBeVisible();
		await expect(getInvestmentPurchaseDeleteBtns(page).first()).toBeVisible();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});

	test('should collapse row on second click', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).toBeVisible();
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetails(page)).not.toBeVisible();
		await deleteAllInvestments(page);
	});

	test('should show purchase row', async ({ page }) => {
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentExpandedDetailAmount(page).first()).toBeVisible();
		await expect(getInvestmentExpandedDetailDate(page).first()).toBeVisible();
		await expect(getInvestmentExpandedDetailType(page).first()).toBeVisible();
		await expect(getInvestmentExpandedDetailNote(page).first()).toBeVisible();
		await expect(getInvestmentPurchaseEditBtns(page).first()).toBeVisible();
		await expect(getInvestmentPurchaseDeleteBtns(page).first()).toBeVisible();

		await expect(getInvestmentExpandedDetailAmount(page)).toHaveCount(1);
		await expect(getInvestmentExpandedDetailDate(page)).toHaveCount(1);
		await expect(getInvestmentExpandedDetailType(page)).toHaveCount(1);
		await expect(getInvestmentExpandedDetailNote(page)).toHaveCount(1);
		await expect(getInvestmentPurchaseEditBtns(page)).toHaveCount(1);
		await expect(getInvestmentPurchaseDeleteBtns(page)).toHaveCount(1);

		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});
});

// Create dialog - validators (opened via empty state btn — all fields enabled)
test.describe('Create investment dialog - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
		await getInvestmentsEmptyCreateBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
	});

	test('should show required error on asset when touched and left empty', async ({ page }) => {
		await getInvestmentAssetInput(page).click();
		await getInvestmentAssetInput(page).blur();
		await expect(page.getByText(investmentsData.errors.required)).toBeVisible();
		await getInvestmentCancelBtn(page).click();
	});

	test('should show maxLength error on asset when exceeding 100 chars', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'a'.repeat(investmentsData.validation.maxAssetLength + 1));
		await expect(page.getByText(investmentsData.errors.maxLength, { exact: false })).toBeVisible();
		await getInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
	});

	test('should show required error on purchase date when touched and left empty', async ({ page }) => {
		await getInvestmentPurchaseDateInput(page).fill('');
		await getInvestmentPurchaseDateInput(page).blur();
		await expect(page.getByText(investmentsData.errors.required)).toBeVisible();
		await getInvestmentCancelBtn(page).click();
	});

	test('should show required error on type when opened and closed without selection', async ({ page }) => {
		await getInvestmentTypeSelect(page).click();
		await page.keyboard.press('Escape');
		await expect(page.getByText(investmentsData.errors.required)).toBeVisible();
		await getInvestmentCancelBtn(page).click();
	});

	test('should show min value error on amount when set to 0', async ({ page }) => {
		await getInvestmentAmountInput(page).fill('0');
		await getInvestmentAmountInput(page).blur();
		await expect(page.getByText(investmentsData.errors.minValue, { exact: false })).toBeVisible();
		await getInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
	});

	test('should show maxLength error on note when exceeding 500 chars', async ({ page }) => {
		await fillAndBlur(getInvestmentNoteInput(page), 'a'.repeat(investmentsData.validation.maxNoteLength + 1));
		await expect(page.getByText(investmentsData.errors.maxLength, { exact: false })).toBeVisible();
		await getInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
	});
});

// Create dialog - locked fields (opened via Add Purchase action on an existing investment)
test.describe('Create investment dialog - locked fields via Add Purchase', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
		const firstRow = getInvestmentListRows(page).first();
		await firstRow.click();
		await getInvestmentMenuTrigger(firstRow).click();
		await getInvestmentAddPurchaseAction(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
	});

	test('should display the "Add Purchase" title when opened via row action', async ({ page }) => {
		await expect(getCreateInvestmentDialogTitle(page)).toContainText(investmentsData.dialogs.addPurchaseTitle);
		await getInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should have asset input disabled when opened via Add Purchase', async ({ page }) => {
		await expect(getInvestmentAssetInput(page)).toBeDisabled();
		await getInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should have type select disabled when opened via Add Purchase', async ({ page }) => {
		await expect(getInvestmentTypeSelect(page)).toBeDisabled();
		await getInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});
});

// Create dialog - clear buttons
test.describe('Create investment dialog - clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
		await getInvestmentsEmptyCreateBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
	});

	test('should clear asset via clear button', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Some Asset');
		await getInvestmentAssetClearBtn(page).click();
		await expect(getInvestmentAssetInput(page)).toHaveValue('');
		await getInvestmentCancelBtn(page).click();
	});

	test('should clear note via clear button', async ({ page }) => {
		await fillAndBlur(getInvestmentNoteInput(page), 'Some note');
		await getInvestmentNoteClearBtn(page).click();
		await expect(getInvestmentNoteInput(page)).toHaveValue('');
		await getInvestmentCancelBtn(page).click();
	});
});

// Create dialog - unsaved changes guard
test.describe('Create investment dialog - unsaved changes guard', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
		await getInvestmentsEmptyCreateBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
	});

	test('should close dialog without confirm when form is pristine and cancel is clicked', async ({ page }) => {
		await getInvestmentCancelBtn(page).click();
		await expect(getInvestmentConfirmExitDialog(page)).not.toBeVisible();
	});

	test('should show confirm exit dialog when cancel is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Unsaved Asset');
		await getInvestmentCancelBtn(page).click();
		await expect(getInvestmentConfirmExitDialog(page)).toBeVisible();
		await getInvestmentConfirmExitContinueBtn(page).click();
	});

	test('should keep dialog open when confirm exit cancel is clicked', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Unsaved Asset');
		await getInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitCancelBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
		await getInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).last().click();
	});

	test('should close dialog when confirm exit continue is clicked', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Unsaved Asset');
		await getInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).not.toBeVisible();
	});

	test('should close dialog when X button is clicked with pristine form', async ({ page }) => {
		await getCreateInvestmentDialogCloseBtn(page).click();
		await expect(getInvestmentConfirmExitDialog(page)).not.toBeVisible();
	});

	test('should show confirm exit dialog when X button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Unsaved Asset');
		await getCreateInvestmentDialogCloseBtn(page).click();
		await expect(getInvestmentConfirmExitDialog(page)).toBeVisible();
		await getInvestmentConfirmExitContinueBtn(page).click();
	});

	test('should close dialog when clicking outside with pristine form', async ({ page }) => {
		await page.mouse.click(0, 0);
		await expect(getInvestmentConfirmExitDialog(page)).not.toBeVisible();
	});

	test('should show confirm exit dialog when clicking outside with dirty form', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Unsaved Asset');
		await page.mouse.click(0, 0);
		await expect(getInvestmentConfirmExitDialog(page)).toBeVisible();
		await getInvestmentConfirmExitContinueBtn(page).click();
	});
});

// Edit dialog - structure
test.describe('Edit investment dialog - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
		await openEditDialog(page);
	});

	test('should display edit investment dialog', async ({ page }) => {
		await expect(getEditInvestmentDialog(page)).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should have cancel button visible', async ({ page }) => {
		await expect(getEditInvestmentCancelBtn(page)).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should have save button enabled when form is pre-filled with valid data', async ({ page }) => {
		await expect(getInvestmentSaveBtnInner(page)).toBeEnabled();
		await getEditInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should display the "Edit Purchase" title', async ({ page }) => {
		await expect(getEditInvestmentDialog(page)).toContainText(investmentsData.dialogs.editPurchaseTitle);
		await getEditInvestmentCancelBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should type not be disabled when asset name is changed to a non-autofilled one', async ({ page }) => {
		await expect(getInvestmentTypeSelect(page)).toBeDisabled();
		await fillAndBlur(getInvestmentAssetInput(page), 'type non disabled now');
		await expect(getInvestmentTypeSelect(page)).not.toBeDisabled();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).last().click();
		await getInvestmentListRows(page).first().click();
	});
});

// Edit dialog - validators
test.describe('Edit investment dialog - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
		await openEditDialog(page);
	});

	test('should show required error when asset is cleared', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), '');
		await expect(page.getByText(investmentsData.errors.required)).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should show maxLength error on asset when exceeding 100 chars', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'a'.repeat(investmentsData.validation.maxAssetLength + 1));
		await expect(page.getByText(investmentsData.errors.maxLength, { exact: false })).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should show required error when purchase date is cleared', async ({ page }) => {
		await getInvestmentPurchaseDateInput(page).fill('');
		await getInvestmentPurchaseDateInput(page).blur();
		await expect(page.getByText(investmentsData.errors.required)).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should show min value error on amount when set to 0', async ({ page }) => {
		await getInvestmentAmountInput(page).fill('0');
		await getInvestmentAmountInput(page).blur();
		await expect(page.getByText(investmentsData.errors.minValue, { exact: false })).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should show maxLength error on note when exceeding 500 chars', async ({ page }) => {
		await fillAndBlur(getInvestmentNoteInput(page), 'a'.repeat(investmentsData.validation.maxNoteLength + 1));
		await expect(page.getByText(investmentsData.errors.maxLength, { exact: false })).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should disable save button when asset is invalid', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'a'.repeat(investmentsData.validation.maxAssetLength + 1));
		await expect(getInvestmentSaveBtnInner(page)).toBeDisabled();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await deleteAllInvestments(page);
	});
});

// Edit dialog - unsaved changes guard
test.describe('Edit investment dialog - unsaved changes guard', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
		await openEditDialog(page);
	});

	test('should close dialog without confirm when form is pristine and X is clicked', async ({ page }) => {
		await getEditInvestmentDialogCloseBtn(page).click();
		await expect(getInvestmentConfirmExitDialog(page)).not.toBeVisible();
		await expect(getEditInvestmentDialog(page)).not.toBeVisible();
		await deleteAllInvestments(page);
	});

	test('should show confirm exit dialog when cancel is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Dirty Asset');
		await getEditInvestmentCancelBtn(page).click();
		await expect(getInvestmentConfirmExitDialog(page)).toBeVisible();
		await getInvestmentConfirmExitContinueBtn(page).click();
		await deleteAllInvestments(page);
	});

	test('should keep edit dialog open when confirm exit cancel is clicked', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Dirty Asset');
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitCancelBtn(page).click();
		await expect(getEditInvestmentDialog(page)).toBeVisible();
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).last().click();
		await deleteAllInvestments(page);
	});

	test('should close edit dialog when confirm exit continue is clicked', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Dirty Asset');
		await getEditInvestmentCancelBtn(page).click();
		await getInvestmentConfirmExitContinueBtn(page).last().click();
		await expect(getEditInvestmentDialog(page)).not.toBeVisible();
		await deleteAllInvestments(page);
	});

	test('should show confirm exit dialog when X button is clicked with dirty form', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Dirty Asset');
		await getEditInvestmentDialogCloseBtn(page).click();
		await expect(getInvestmentConfirmExitDialog(page)).toBeVisible();
		await getInvestmentConfirmExitContinueBtn(page).last().click();
		await deleteAllInvestments(page);
	});

	test('should show confirm exit dialog when clicking outside dialog with dirty form', async ({ page }) => {
		await fillAndBlur(getInvestmentAssetInput(page), 'Dirty Asset');
		await page.mouse.click(0, 0);
		await expect(getInvestmentConfirmExitDialog(page)).toBeVisible();
		await getInvestmentConfirmExitContinueBtn(page).last().click();
		await deleteAllInvestments(page);
	});
});

// Create investment dialog - submit and cancel
test.describe('Create investment dialog - submit and cancel', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
	});

	test('should create investment and show it in the list', async ({ page }) => {
		await createInvestment(page, getInvestmentsEmptyCreateBtn(page));
		await expect(getInvestmentListRows(page).first()).toBeVisible();
		await expect(getInvestmentListRows(page)).toHaveCount(1);
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentPurchaseAmounts(page)).toHaveCount(1);
		await deleteAllInvestments(page);
	});

	test('should close dialog on cancel without dirty changes', async ({ page }) => {
		await getInvestmentsEmptyCreateBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).toBeVisible();
		await getInvestmentCancelBtn(page).click();
		await expect(getCreateInvestmentDialog(page)).not.toBeVisible();
	});

	test('should create new purchase for existing asset', async ({ page }) => {
		await createInvestment(page, getInvestmentsEmptyCreateBtn(page));
		await expect(getInvestmentListRows(page)).toHaveCount(1);
		const firstRow = getInvestmentListRows(page).first();
		await expect(firstRow).toBeVisible();
		await firstRow.click();
		await expect(getInvestmentPurchaseAmounts(page)).toHaveCount(1);
		await getInvestmentMenuTrigger(firstRow).click();
		await getInvestmentAddPurchaseAction(page).click();
		await expect(getCreateInvestmentDialogTitle(page)).toHaveText('Add Purchase');

		await expect(getInvestmentAssetInput(page)).toBeDisabled();
		await expect(getInvestmentTypeSelect(page)).toBeDisabled();
		await getInvestmentPurchaseDateInput(page).fill(formatDateForInput(addDays(new Date(), 60)));
		await getInvestmentAmountInput(page).fill('1000');
		await getInvestmentCreateBtnInner(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getInvestmentListRows(page)).toHaveCount(1);
		await expect(getInvestmentPurchaseAmounts(page)).toHaveCount(2);
		await firstRow.click();
		await deleteAllInvestments(page);
	});
});

// Edit dialog - clear buttons
test.describe('Edit investment dialog - clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestments(page, context);
		await openEditDialog(page);
	});

	test('should clear asset via clear button', async ({ page }) => {
		await expect(getInvestmentAssetInput(page)).not.toHaveValue('');
		await getInvestmentAssetClearBtn(page).click();
		await expect(getInvestmentAssetInput(page)).toHaveValue('');
		await getInvestmentCancelBtn(page).click();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});

	test('should clear note via clear button', async ({ page }) => {
		await expect(getInvestmentNoteInput(page)).not.toHaveValue('');
		await getInvestmentNoteClearBtn(page).click();
		await expect(getInvestmentNoteInput(page)).toHaveValue('');
		await getInvestmentCancelBtn(page).click();
		await getInvestmentListRows(page).first().click();
		await deleteAllInvestments(page);
	});
});

// Edit purchase - move to other asset
test.describe('Edit purchase - move to other asset', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupInvestmentsEmpty(page, context);
		await createInvestment(page, getInvestmentsEmptyCreateBtn(page), { asset: 'asset1' });
		const firstRow = getInvestmentListRows(page).first();
		await firstRow.click();
		await getInvestmentMenuTrigger(firstRow).click();
		await getInvestmentAddPurchaseAction(page).click();
		await getInvestmentPurchaseDateInput(page).fill(formatDateForInput(addDays(new Date(), 1)));
		await getInvestmentAmountInput(page).fill('100');
		await getInvestmentCreateBtnInner(page).click();
		await firstRow.click();
		await createInvestment(page, getInvestmentListAddBtn(page), { asset: 'asset2' });
	});

	test('should move purchase to other existing asset', async ({ page }) => {
		await getInvestmentListRows(page).filter({ hasText: 'asset1' }).click();
		await expect(getInvestmentExpandedDetailAmount(page)).toHaveCount(2);
		await getInvestmentPurchaseEditBtns(page).first().click();
		await getInvestmentAssetClearBtn(page).click();
		await getInvestmentAssetInput(page).click();
		await getInvestmentAssetInput(page).fill('asset2');
		await getInvestmentSaveBtnInner(page).click();
		await getInvestmentListRows(page).first().click();
		await getInvestmentListRows(page).filter({ hasText: 'asset2' }).click();
		await expect(getInvestmentExpandedDetailAmount(page)).toHaveCount(2);
		await deleteAllInvestments(page);
	});

	test('should move purchse to non existing asset resulting in new line in list', async ({ page }) => {
		await getInvestmentListRows(page).filter({ hasText: 'asset1' }).click();
		await expect(getInvestmentExpandedDetailAmount(page)).toHaveCount(2);
		await getInvestmentPurchaseEditBtns(page).first().click();
		await getInvestmentAssetClearBtn(page).click();
		await getInvestmentAssetInput(page).click();
		await getInvestmentAssetInput(page).fill('asset3');
		await getInvestmentSaveBtnInner(page).click();
		await getInvestmentListRows(page).first().click();
		await expect(getInvestmentListRows(page)).toHaveCount(3);
		await deleteAllInvestments(page);
	});
});
