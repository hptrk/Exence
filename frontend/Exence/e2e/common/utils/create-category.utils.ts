import { Page } from '@playwright/test';
import { fillAndBlur } from '../../form/utils/form-utils';
import {
	getCategoryNameInput,
	getCategorySubmitBtn,
	getCategoryTypeToggle,
	getFirstColorOption,
	getFirstIconOption,
	getIconPickerTrigger,
} from '../../category/locators/category-dialog-locators';

export type CategoryType = 'EXPENSE' | 'INCOME' | 'MIXED';

export interface CreateCategoryData {
	name: string;
	/** Defaults to EXPENSE when omitted (matches the dialog's default). */
	type?: CategoryType;
}

async function selectIconAndColor(page: Page): Promise<string> {
	await getIconPickerTrigger(page).click();

	const firstColor = getFirstColorOption(page);
	await firstColor.waitFor({ state: 'visible' });
	const color = (await firstColor.getAttribute('data-color'))!;
	await firstColor.click();

	const firstIcon = getFirstIconOption(page);
	await firstIcon.waitFor({ state: 'visible' });
	await firstIcon.click();

	// Menu auto-closes once both icon and color are chosen
	await firstColor.waitFor({ state: 'hidden' });
	return color;
}

export interface CreateCategoryResult {
	color: string;
}

export async function createCategory(page: Page, data: CreateCategoryData): Promise<CreateCategoryResult> {
	if (data.type) {
		await getCategoryTypeToggle(page).getByText(data.type, { exact: true }).click();
	}

	await fillAndBlur(getCategoryNameInput(page), data.name);
	const color = await selectIconAndColor(page);

	const submitBtn = getCategorySubmitBtn(page);
	await submitBtn.waitFor({ state: 'visible' });
	await submitBtn.click();

	return { color };
}
