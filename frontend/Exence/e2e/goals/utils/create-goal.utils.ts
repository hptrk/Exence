import { expect, Locator, Page } from '@playwright/test';
import { addDays, subDays } from 'date-fns';
import { fillAndBlur, formatDateForInput } from '../../form/utils/form-utils';
import { getSnackbarCloseBtn, getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import goalsData from '../data/goals.data.json';
import {
	getCreateGoalDialog,
	getEditGoalDialog,
	getFirstCategoryOption,
	getGoalCategorySelect,
	getGoalCreateBtnInner,
	getGoalCurrencySelect,
	getGoalDeadlineInput,
	getGoalDescriptionInput,
	getGoalInitialAmountInput,
	getGoalSaveBtnInner,
	getGoalStatusSelect,
	getGoalTargetAmountInput,
	getGoalTitleInput,
	getStatusOption,
} from '../locators/goals-dialog-locators';
import {
	getGoalDeleteAction,
	getGoalEditAction,
	getGoalListAddBtn,
	getGoalListRows,
	getGoalMenuTrigger,
	getGoalsEmptyState,
} from '../locators/goals-locators';

export async function createGoal(page: Page, openBtn: Locator, data: Partial<CreateGoalData> = {}): Promise<void> {
	const merged = {
		title: data.title ?? goalsData.createGoal.title,
		targetAmount: data.targetAmount ?? goalsData.createGoal.targetAmount,
		initialAmount: data.initialAmount !== undefined ? data.initialAmount : goalsData.createGoal.initialAmount,
		currency: data.currency ?? goalsData.createGoal.currency,
		description: data.description !== undefined ? data.description : goalsData.createGoal.description,
		deadline: data.deadline ?? addDays(new Date(), 30),
	};

	await openBtn.click();
	await expect(getCreateGoalDialog(page)).toBeVisible();

	await fillAndBlur(getGoalTitleInput(page), merged.title);

	await getGoalTargetAmountInput(page).fill(String(merged.targetAmount));
	await getGoalTargetAmountInput(page).blur();

	await getGoalInitialAmountInput(page).fill(String(merged.initialAmount));
	await getGoalInitialAmountInput(page).blur();

	await fillAndBlur(getGoalDeadlineInput(page), formatDateForInput(merged.deadline));

	await getGoalCurrencySelect(page).click();
	await page.locator('mat-option').filter({ hasText: merged.currency }).first().click();

	await getGoalCategorySelect(page).click();
	await getFirstCategoryOption(page).click();

	await fillAndBlur(getGoalDescriptionInput(page), merged.description);

	await getGoalCreateBtnInner(page).click();

	await expect(getSuccessSnackbar(page)).toBeVisible();
	await getSnackbarCloseBtn(page).last().click();
}

export async function createExpiredGoal(page: Page, title: string): Promise<void> {
	await createGoal(page, getGoalListAddBtn(page), { title });
	const row = getGoalListRows(page).filter({ has: page.getByText(title, { exact: true }) });
	await row.click();
	await getGoalMenuTrigger(row).click();
	await getGoalEditAction(page).click();
	await expect(getEditGoalDialog(page)).toBeVisible();
	await fillAndBlur(getGoalDeadlineInput(page), formatDateForInput(subDays(new Date(), 1)));
	await getGoalStatusSelect(page).click();
	await getStatusOption(page, goalsData.statuses.expired).click();
	await getGoalSaveBtnInner(page).click();
	await expect(getSuccessSnackbar(page)).toBeVisible();
	await getSnackbarCloseBtn(page).click();
}

export interface CreateGoalData {
	title?: string;
	targetAmount?: number;
	initialAmount?: number;
	currency?: string;
	description?: string;
	deadline?: Date;
}

export async function deleteGoal(page: Page): Promise<void> {
	const firstRow = getGoalListRows(page).first();
	await firstRow.click();
	await getGoalMenuTrigger(firstRow).click();
	await getGoalDeleteAction(page).click();
}

export async function deleteAllGoals(page: Page): Promise<void> {
	while (!(await getGoalsEmptyState(page).isVisible())) {
		await deleteGoal(page);
		await page.waitForTimeout(100);
	}
}

export async function openCreateDialog(page: Parameters<typeof getCreateGoalDialog>[0]): Promise<void> {
	await getGoalListAddBtn(page).click();
	await expect(getCreateGoalDialog(page)).toBeVisible();
}

export async function openEditDialog(page: Parameters<typeof getGoalListRows>[0]): Promise<void> {
	const firstRow = getGoalListRows(page).first();
	await firstRow.click();
	await getGoalMenuTrigger(firstRow).click();
	await getGoalEditAction(page).click();
	await expect(getEditGoalDialog(page)).toBeVisible();
}
