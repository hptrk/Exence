import test, { expect } from '@playwright/test';
import { getSuccessSnackbar } from '../../../snackbar/locators/snackbar-locators';
import data from '../data/user-settings.data.json';
import {
	getLanguageCard,
	getLanguageCards,
	getLanguageList,
	getPrimaryThemeSelect,
	getSecondaryThemeSelect,
	getSelectedLanguageCard,
	getThemeOptions,
	getThemeSelectError,
	getUserSettingsCancelBtn,
	getUserSettingsSaveBtn,
	getUserSettingsSaveBtnInner,
	getUserSettingsSpinner,
} from '../locators/user-settings-locators';
import { setupUserSettings } from '../utils/setup-user-settings.util';

// User settings - Theme - structure
test.describe('User settings - Theme - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should show primary and secondary theme selects', async ({ page }) => {
		await expect(getPrimaryThemeSelect(page)).toBeVisible();
		await expect(getSecondaryThemeSelect(page)).toBeVisible();
	});
});

// User settings - Theme - options
test.describe('User settings - Theme - options', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should show 4 colors per theme option', async ({ page }) => {
		await getPrimaryThemeSelect(page).click();
		await expect(getThemeOptions(page).first().getByTestId('theme-color-square')).toHaveCount(data.colorsPerTheme);
		await page.keyboard.press('Escape');
	});
});

// User settings - Theme - current indicator
test.describe('User settings - Theme - current indicator', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should show current indicator on the currently applied theme (dark)', async ({ page }) => {
		await getPrimaryThemeSelect(page).click();
		await expect(
			getThemeOptions(page).filter({ hasText: data.themeNames.dark }).getByTestId('theme-current-indicator'),
		).toBeVisible();
		await page.keyboard.press('Escape');
	});

	test('should move current indicator to light theme after saving primary as light', async ({ page }) => {
		await getPrimaryThemeSelect(page).click();
		await getThemeOptions(page).filter({ hasText: data.themeNames.light }).click();
		await getUserSettingsSaveBtn(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();

		await getPrimaryThemeSelect(page).click();
		await expect(
			getThemeOptions(page).filter({ hasText: data.themeNames.light }).getByTestId('theme-current-indicator'),
		).toBeVisible();
		await page.keyboard.press('Escape');
	});
});

// User settings - Theme - validators
test.describe('User settings - Theme - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should show error when primary and secondary themes are the same', async ({ page }) => {
		await getSecondaryThemeSelect(page).click();
		await getThemeOptions(page).filter({ hasText: data.themeNames.dark }).click();
		await expect(getThemeSelectError(page)).toBeVisible();
		await expect(getThemeSelectError(page)).toContainText(data.themeError);
	});
});

// User settings - Language - structure
test.describe('User settings - Language - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should show 8 language cards', async ({ page }) => {
		await expect(getLanguageCards(page)).toHaveCount(data.languages.count);
	});

	test('should show selected language card with emphasis', async ({ page }) => {
		await expect(getSelectedLanguageCard(page)).toBeVisible();
		await expect(getLanguageCard(page, data.languages.initial)).toHaveClass(/selected/);
	});
});

// User settings - Language - overflow
test.describe('User settings - Language - overflow', () => {
	test.use({ viewport: { width: 800, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should overflow language list on x axis under 992px width', async ({ page }) => {
		const isOverflowing = await getLanguageList(page).evaluate(el => el.scrollWidth > el.clientWidth);
		expect(isOverflowing).toBe(true);
	});
});

// User settings - Save button
test.describe('User settings - Save button', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should be disabled on init', async ({ page }) => {
		await expect(getUserSettingsSaveBtnInner(page)).toBeDisabled();
	});

	test('should be enabled when primary theme changes', async ({ page }) => {
		await getPrimaryThemeSelect(page).click();
		await getThemeOptions(page).filter({ hasText: data.themeNames.light }).click();
		await expect(getUserSettingsSaveBtnInner(page)).toBeEnabled();
	});

	test('should be enabled when secondary theme changes', async ({ page }) => {
		await getSecondaryThemeSelect(page).click();
		await getThemeOptions(page).filter({ hasText: data.themeNames.light }).click();
		await expect(getUserSettingsSaveBtnInner(page)).toBeEnabled();
	});

	test('should be enabled when language changes', async ({ page }) => {
		await getLanguageCard(page, data.languages.german).click();
		await expect(getUserSettingsSaveBtnInner(page)).toBeEnabled();
	});
});

// User settings - Cancel
test.describe('User settings - Cancel', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should reset language to initial on cancel', async ({ page }) => {
		await getLanguageCard(page, data.languages.german).click();
		await expect(getLanguageCard(page, data.languages.german)).toHaveClass(/selected/);
		await getUserSettingsCancelBtn(page).click();
		await expect(getLanguageCard(page, data.languages.initial)).toHaveClass(/selected/);
		await expect(getLanguageCard(page, data.languages.german)).not.toHaveClass(/selected/);
	});

	test('should reset primary and secondary themes to initial on cancel', async ({ page }) => {
		await getPrimaryThemeSelect(page).click();
		await getThemeOptions(page).filter({ hasText: data.themeNames.light }).click();
		await expect(getPrimaryThemeSelect(page)).toContainText(data.themeNames.light);
		await getUserSettingsCancelBtn(page).click();
		await expect(getPrimaryThemeSelect(page)).toContainText(data.themeNames.dark);
		await expect(getSecondaryThemeSelect(page)).toContainText(data.themeNames.blueDolphin);
	});
});

// User settings - Spinner
test.describe('User settings - Spinner', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should show spinner while saving', async ({ page }) => {
		await getLanguageCard(page, data.languages.german).click();
		await getUserSettingsSaveBtn(page).click();
		await expect(getUserSettingsSpinner(page)).toBeVisible();
	});
});

// User settings - Translation
test.describe('User settings - Translation', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupUserSettings(page, context);
	});

	test('should update save button text after changing language to German', async ({ page }) => {
		await expect(getUserSettingsSaveBtn(page)).toContainText(data.buttons.saveEn);
		await getLanguageCard(page, data.languages.german).click();
		await getUserSettingsSaveBtn(page).click();
		await expect(getUserSettingsSpinner(page)).not.toBeVisible();
		await expect(getUserSettingsSaveBtn(page)).toContainText(data.buttons.saveDe);
	});
});
