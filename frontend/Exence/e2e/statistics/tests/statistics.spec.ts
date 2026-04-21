import { expect, test } from '@playwright/test';
import { fillAndBlur } from '../../form/utils/form-utils';
import statisticsData from '../data/statistics.data.json';
import {
	getAddMenuItem,
	getCancelBtn,
	getCatalogCategorySelect,
	getCatalogCreateBtn,
	getCatalogDeselectAllBtn,
	getCatalogDialog,
	getCatalogItemInfoBtns,
	getCatalogItems,
	getCatalogNextBtn,
	getCatalogSelectAllBtn,
	getCatalogTabAll,
	getCatalogTabCards,
	getCatalogTitleInput,
	getCatalogTooltip,
	getChartWidgetDeleteBtns,
	getChartWidgetDraggers,
	getChartWidgetEditBtns,
	getChartWidgetItems,
	getChartWidgetResizeHandle,
	getConfirmExitContinueBtn,
	getEditChartCancelBtn,
	getEditChartCategorySelect,
	getEditChartDialog,
	getEditChartSaveBtn,
	getEditChartTitleInput,
	getEditMenuItem,
	getEmptyState,
	getFirstFormError,
	getMoreBtn,
	getSaveBtn,
	getStatCardDeleteBtns,
	getStatCardDraggers,
	getStatCardEditBtns,
	getStatCardItems,
	getStatCardList,
	getStatCardScrollableList,
} from '../locators/statistics-locators';
import {
	addNonFilterableChart,
	addStatCard,
	enterEditMode,
	goBackFromCustomize,
	openCatalog,
	proceedToCustomize,
	selectCatalogWidgetByTitle,
} from '../utils/add-widget.utils';
import { setupStatistics, setupStatisticsWithCategory } from '../utils/setup-statistics.utils';
import {
	assertNoPutSent,
	waitForLayoutGet,
	waitForLayoutPut,
	waitForWidgetCreate,
} from '../utils/widget-request.utils';

test.describe('Statistics - init', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatistics(page, context);
	});

	test('should display the more button on init', async ({ page }) => {
		await expect(getMoreBtn(page)).toBeVisible();
	});

	test('should display empty state when no widgets exist', async ({ page }) => {
		await expect(getEmptyState(page)).toBeVisible();
	});

	test('should not display edit layout menu item when page is empty', async ({ page }) => {
		await getMoreBtn(page).click();
		await expect(getEditMenuItem(page)).not.toBeVisible();
	});

	test('should display add widget menu item when page is empty', async ({ page }) => {
		await getMoreBtn(page).click();
		await expect(getAddMenuItem(page)).toBeVisible();
	});
});

// Menu (with widgets)
test.describe('Statistics - menu', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addNonFilterableChart(page);
		await getChartWidgetItems(page).first().waitFor({ state: 'visible' });
	});

	test('should display edit layout option when widgets exist', async ({ page }) => {
		await getMoreBtn(page).click();
		await expect(getEditMenuItem(page)).toBeVisible();
	});

	test('should display add widget option when widgets exist', async ({ page }) => {
		await getMoreBtn(page).click();
		await expect(getAddMenuItem(page)).toBeVisible();
	});
});

// Catalog
test.describe('Statistics - catalog', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
	});

	test('should open catalog dialog on add widget click', async ({ page }) => {
		await openCatalog(page);
		await expect(getCatalogDialog(page)).toBeVisible();
	});

	test('should disable next button when no widget selected', async ({ page }) => {
		await openCatalog(page);
		await expect(getCatalogNextBtn(page)).toHaveClass(/disabled/);
	});

	test('should add selected class to selected widget', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		const firstItem = getCatalogItems(page).first();
		await firstItem.click();
		await expect(firstItem).toHaveClass(/selected/);
	});

	test('should allow only one widget to be selected at a time', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		const items = getCatalogItems(page);
		const itemA = items.nth(0);
		const itemB = items.nth(1);
		await itemA.click();
		await expect(itemA).toHaveClass(/selected/);
		await itemB.click();
		await expect(itemA).not.toHaveClass(/selected/);
		await expect(itemB).toHaveClass(/selected/);
	});

	test('should deselect a widget on second click', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		const firstItem = getCatalogItems(page).first();
		await firstItem.click();
		await expect(firstItem).toHaveClass(/selected/);
		await firstItem.click();
		await expect(firstItem).not.toHaveClass(/selected/);
	});

	test('should show info tooltip on info button hover', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await getCatalogItemInfoBtns(page).first().hover();
		await expect(getCatalogTooltip(page)).toBeVisible();
	});

	test('should enable next button after selecting a widget', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await getCatalogItems(page).first().click();
		await expect(getCatalogNextBtn(page)).not.toHaveClass(/disabled/);
	});

	test('should move to step 2 (customize) on next click', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await proceedToCustomize(page);
		await expect(getCatalogTitleInput(page)).toBeVisible();
	});

	test('should pre-fill title from widget name', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await proceedToCustomize(page);
		await expect(getCatalogTitleInput(page)).not.toHaveValue('');
	});

	test('should disable create button when title is empty', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await proceedToCustomize(page);
		await fillAndBlur(getCatalogTitleInput(page), '');
		await expect(getCatalogCreateBtn(page)).toHaveClass(/disabled/);
	});

	test('should show error when title is cleared', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await proceedToCustomize(page);
		await fillAndBlur(getCatalogTitleInput(page), '');
		await expect(getFirstFormError(page)).toBeVisible();
	});

	test('should disable create button when title exceeds 255 chars', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await proceedToCustomize(page);
		await fillAndBlur(getCatalogTitleInput(page), 'a'.repeat(statisticsData.validation.maxTitleLength + 1));
		await expect(getCatalogCreateBtn(page)).toHaveClass(/disabled/);
	});

	test('should not show category select for non-filterable widget (SAVINGS_RATE_GAUGE)', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await proceedToCustomize(page);
		await expect(getCatalogCategorySelect(page)).not.toBeVisible();
	});

	test('should show category select for filterable widget (EXPENSE_FREQUENCY_STATCARD)', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabCards(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.expenseFrequency.title);
		await proceedToCustomize(page);
		await expect(getCatalogCategorySelect(page)).toBeVisible();
	});

	test('should work select all and deselect all in catalog', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabCards(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.expenseFrequency.title);
		await proceedToCustomize(page);

		await getCatalogCategorySelect(page).click();
		await expect(getCatalogDeselectAllBtn(page)).toBeVisible();
		await getCatalogDeselectAllBtn(page).click();
		await expect(getCatalogSelectAllBtn(page)).toBeVisible();
		await getCatalogSelectAllBtn(page).click();
		await expect(getCatalogDeselectAllBtn(page)).toBeVisible();
	});

	test('should navigate back to step 1 on back click', async ({ page }) => {
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await proceedToCustomize(page);
		await goBackFromCustomize(page);
		await expect(getCatalogNextBtn(page)).toBeVisible();
	});

	test('should not add widget when catalog is closed without creating', async ({ page }) => {
		const initialCount = await getChartWidgetItems(page).count();
		await openCatalog(page);
		await getCatalogTabAll(page).click();
		await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
		await page.keyboard.press('Escape');
		await expect(getCatalogDialog(page)).not.toBeVisible();
		await expect(getChartWidgetItems(page)).toHaveCount(initialCount);
	});

	test('should add non-filterable chart widget on create', async ({ page }) => {
		const [request] = await Promise.all([waitForWidgetCreate(page), addNonFilterableChart(page)]);
		expect(request).toBeTruthy();
		await expect(getChartWidgetItems(page)).toHaveCount(1);
	});

	test('should add stat card on create', async ({ page }) => {
		const [request] = await Promise.all([waitForWidgetCreate(page), addStatCard(page)]);
		expect(request).toBeTruthy();
		await expect(getStatCardItems(page)).toHaveCount(1);
	});

	test('should disable stat card types in catalog when 4 stat cards already exist', async ({ page }) => {
		for (let i = 0; i < statisticsData.maxStatCards; i++) {
			await addStatCard(page, `Card ${i + 1}`);
			await getStatCardItems(page).nth(i).waitFor({ state: 'visible' });
		}
		await openCatalog(page);
		await getCatalogTabCards(page).click();
		await expect(getCatalogItems(page).first()).toHaveClass(/disabled/);
	});
});

// Stat card layout
test.describe('Statistics - stat card layout', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addStatCard(page, 'Card 1');
		await getStatCardItems(page).first().waitFor({ state: 'visible' });
		await addStatCard(page, 'Card 2');
		await getStatCardItems(page).nth(1).waitFor({ state: 'visible' });
		await addStatCard(page, 'Card 3');
		await getStatCardItems(page).nth(2).waitFor({ state: 'visible' });
	});

	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test('should display all stat cards in a single horizontal row', async ({ page }) => {
			await expect(getStatCardList(page)).toBeVisible();
			const items = getStatCardItems(page);
			await expect(items).toHaveCount(3);
			const firstBox = await items.first().boundingBox();
			const lastBox = await items.last().boundingBox();
			expect(firstBox).not.toBeNull();
			expect(lastBox).not.toBeNull();
			expect(Math.abs(firstBox!.y - lastBox!.y)).toBeLessThan(10);
		});
	});

	test.describe('on small screens', () => {
		test.use({ viewport: { width: 500, height: 700 } });

		test('should be horizontally scrollable on small screens', async ({ page }) => {
			const cardListDiv = getStatCardScrollableList(page);
			const isScrollable = await cardListDiv.evaluate(el => el.scrollWidth > el.clientWidth);
			expect(isScrollable).toBe(true);
		});
	});
});

// Edit mode - chart widgets
test.describe('Statistics - edit mode (chart widgets)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addNonFilterableChart(page);
		await getChartWidgetItems(page).first().waitFor({ state: 'visible' });
	});

	test('should show cancel and save buttons in edit mode', async ({ page }) => {
		await enterEditMode(page);
		await expect(getCancelBtn(page)).toBeVisible();
		await expect(getSaveBtn(page)).toBeVisible();
		await expect(getMoreBtn(page)).not.toBeVisible();
	});

	test('should show drag indicator on chart widgets in edit mode', async ({ page }) => {
		await enterEditMode(page);
		await expect(getChartWidgetDraggers(page).first()).toBeVisible();
	});

	test('should show edit and delete buttons on chart widgets in edit mode', async ({ page }) => {
		await enterEditMode(page);
		await expect(getChartWidgetEditBtns(page).first()).toBeVisible();
		await expect(getChartWidgetDeleteBtns(page).first()).toBeVisible();
	});

	test('should hide drag/edit/delete buttons when not in edit mode', async ({ page }) => {
		await expect(getChartWidgetDraggers(page)).toHaveCount(0);
		await expect(getChartWidgetEditBtns(page)).toHaveCount(0);
		await expect(getChartWidgetDeleteBtns(page)).toHaveCount(0);
	});

	test('should open edit dialog on chart edit button click', async ({ page }) => {
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await expect(getEditChartDialog(page)).toBeVisible();
	});

	test('should show correct title in edit dialog', async ({ page }) => {
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await expect(getEditChartTitleInput(page)).toHaveValue(statisticsData.widgets.savingsRateGauge.title);
	});

	test('should disable save button when edit dialog title is empty', async ({ page }) => {
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await fillAndBlur(getEditChartTitleInput(page), '');
		await expect(getEditChartSaveBtn(page)).toHaveClass(/disabled/);
		await expect(getFirstFormError(page)).toBeVisible();
	});

	test('should disable save button when edit dialog title exceeds 255 chars', async ({ page }) => {
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await fillAndBlur(getEditChartTitleInput(page), 'a'.repeat(statisticsData.validation.maxTitleLength + 1));
		await expect(getEditChartSaveBtn(page)).toHaveClass(/disabled/);
	});

	test('should close edit dialog and update UI title on save without sending PUT', async ({ page }) => {
		const newTitle = 'Updated Chart Title';
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await assertNoPutSent(page, async () => {
			await fillAndBlur(getEditChartTitleInput(page), newTitle);
			await getEditChartSaveBtn(page).click();
		});
		await expect(getEditChartDialog(page)).not.toBeVisible();
		await getChartWidgetEditBtns(page).first().click();
		await expect(getEditChartTitleInput(page)).toHaveValue(newTitle);
		await getEditChartCancelBtn(page).click();
	});

	test('should close edit dialog on cancel without applying changes', async ({ page }) => {
		const originalTitle = statisticsData.widgets.savingsRateGauge.title;
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await fillAndBlur(getEditChartTitleInput(page), 'Some Other Title');
		await getEditChartCancelBtn(page).click();
		await getConfirmExitContinueBtn(page).click();
		await expect(getEditChartDialog(page)).not.toBeVisible();
		await getChartWidgetEditBtns(page).first().click();
		await expect(getEditChartTitleInput(page)).toHaveValue(originalTitle);
		await getEditChartCancelBtn(page).click();
	});

	test('should delete chart widget from UI on delete click without sending PUT', async ({ page }) => {
		await enterEditMode(page);
		await assertNoPutSent(page, async () => {
			await getChartWidgetDeleteBtns(page).first().click();
		});
		await expect(getChartWidgetItems(page)).toHaveCount(0);
	});
});

// Edit mode - stat cards
test.describe('Statistics - edit mode (stat cards)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addStatCard(page);
		await getStatCardItems(page).first().waitFor({ state: 'visible' });
	});

	test('should show drag indicator on stat cards in edit mode', async ({ page }) => {
		await enterEditMode(page);
		await expect(getStatCardDraggers(page).first()).toBeVisible();
	});

	test('should show edit and delete buttons on stat cards in edit mode', async ({ page }) => {
		await enterEditMode(page);
		await expect(getStatCardEditBtns(page).first()).toBeVisible();
		await expect(getStatCardDeleteBtns(page).first()).toBeVisible();
	});

	test('should hide drag/edit/delete buttons on stat cards when not in edit mode', async ({ page }) => {
		await expect(getStatCardDraggers(page)).toHaveCount(0);
		await expect(getStatCardEditBtns(page)).toHaveCount(0);
		await expect(getStatCardDeleteBtns(page)).toHaveCount(0);
	});

	test('should open edit dialog on stat card edit button click', async ({ page }) => {
		await enterEditMode(page);
		await getStatCardEditBtns(page).first().click();
		await expect(getEditChartDialog(page)).toBeVisible();
	});

	test('should show category select in edit dialog for filterable stat card', async ({ page }) => {
		await enterEditMode(page);
		await getStatCardEditBtns(page).first().click();
		await expect(getEditChartCategorySelect(page)).toBeVisible();
	});

	test('should close stat card edit dialog and update title on save without sending PUT', async ({ page }) => {
		const newTitle = 'Updated Stat Card Title';
		await enterEditMode(page);
		await getStatCardEditBtns(page).first().click();
		await assertNoPutSent(page, async () => {
			await fillAndBlur(getEditChartTitleInput(page), newTitle);
			await getEditChartSaveBtn(page).click();
		});
		await expect(getEditChartDialog(page)).not.toBeVisible();
	});

	test('should delete stat card from UI on delete click without sending PUT', async ({ page }) => {
		await enterEditMode(page);
		await assertNoPutSent(page, async () => {
			await getStatCardDeleteBtns(page).first().click();
		});
		await expect(getStatCardItems(page)).toHaveCount(0);
	});
});

// Drag and drop
test.describe('Statistics - drag and drop (chart widgets)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addNonFilterableChart(page, 'Chart One');
		await getChartWidgetItems(page).first().waitFor({ state: 'visible' });
		await addNonFilterableChart(page, 'Chart Two');
		await getChartWidgetItems(page).nth(1).waitFor({ state: 'visible' });
	});

	test('should reorder chart widgets via drag on dragger icon', async ({ page }) => {
		await enterEditMode(page);
		const draggers = getChartWidgetDraggers(page);
		const firstBox = await draggers.nth(0).boundingBox();
		const secondBox = await draggers.nth(1).boundingBox();
		expect(firstBox).not.toBeNull();
		expect(secondBox).not.toBeNull();

		const items = getChartWidgetItems(page);
		const secondItemYBefore = (await items.nth(1).boundingBox())!.y;

		await page.mouse.move(secondBox!.x + secondBox!.width / 2, secondBox!.y + secondBox!.height / 2);
		await page.mouse.down();
		await page.waitForTimeout(200); // wait for gridster delayStart
		await page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2, { steps: 20 });
		await page.mouse.up();
		await expect(async () => {
			expect((await getChartWidgetItems(page).nth(1).boundingBox())?.y).not.toBe(secondItemYBefore);
		}).toPass();

		await expect(items).toHaveCount(2);
		const secondItemYAfter = (await items.nth(1).boundingBox())!.y;
		expect(Math.abs(secondItemYAfter - secondItemYBefore)).toBeGreaterThan(100);
	});

	test('should not trigger PUT request during chart drag', async ({ page }) => {
		await enterEditMode(page);
		const draggers = getChartWidgetDraggers(page);
		const firstBox = await draggers.nth(0).boundingBox();
		const secondBox = await draggers.nth(1).boundingBox();

		await assertNoPutSent(page, async () => {
			await page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2);
			await page.mouse.down();
			await page.waitForTimeout(200);
			await page.mouse.move(secondBox!.x + secondBox!.width / 2, secondBox!.y + secondBox!.height / 2, {
				steps: 20,
			});
			await page.mouse.up();
		});
	});
});

test.describe('Statistics - drag and drop (stat cards)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addStatCard(page, 'Card One');
		await getStatCardItems(page).first().waitFor({ state: 'visible' });
		await addStatCard(page, 'Card Two');
		await getStatCardItems(page).nth(1).waitFor({ state: 'visible' });
	});

	test('should reorder stat cards via drag on dragger icon', async ({ page }) => {
		await enterEditMode(page);
		const draggers = getStatCardDraggers(page);
		const firstBox = await draggers.nth(0).boundingBox();
		const secondBox = await draggers.nth(1).boundingBox();
		expect(firstBox).not.toBeNull();
		expect(secondBox).not.toBeNull();

		const items = getStatCardItems(page);
		const firstXBefore = (await items.nth(0).boundingBox())!.x;

		await page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2);
		await page.mouse.down();
		await page.waitForTimeout(200); // wait for gridster delayStart
		await page.mouse.move(secondBox!.x + secondBox!.width / 2, secondBox!.y + secondBox!.height / 2, { steps: 20 });
		await page.mouse.up();
		await expect(async () => {
			expect((await getStatCardItems(page).nth(0).boundingBox())?.x).not.toBe(firstXBefore);
		}).toPass();

		await expect(items).toHaveCount(2);
		const firstXAfter = (await items.nth(0).boundingBox())!.x;
		expect(Math.abs(firstXAfter - firstXBefore)).toBeGreaterThan(100);
	});

	test('should not trigger PUT request during stat card drag', async ({ page }) => {
		await enterEditMode(page);
		const draggers = getStatCardDraggers(page);
		const firstBox = await draggers.nth(0).boundingBox();
		const secondBox = await draggers.nth(1).boundingBox();

		await assertNoPutSent(page, async () => {
			await page.mouse.move(firstBox!.x + firstBox!.width / 2, firstBox!.y + firstBox!.height / 2);
			await page.mouse.down();
			await page.waitForTimeout(200);
			await page.mouse.move(secondBox!.x + secondBox!.width / 2, secondBox!.y + secondBox!.height / 2, {
				steps: 20,
			});
			await page.mouse.up();
		});
	});
});

// Chart resize

test.describe('Statistics - chart resize', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addNonFilterableChart(page, 'Chart One');
		await getChartWidgetItems(page).first().waitFor({ state: 'visible' });
		await addNonFilterableChart(page, 'Chart Two');
		await getChartWidgetItems(page).nth(1).waitFor({ state: 'visible' });
	});

	test('should show resize handles on chart widgets in edit mode', async ({ page }) => {
		await enterEditMode(page);
		await expect(getChartWidgetResizeHandle(getChartWidgetItems(page).first())).toBeVisible();
	});

	test('should push adjacent chart to next row when resized to full width', async ({ page }) => {
		await addNonFilterableChart(page, 'Chart Three');
		await getChartWidgetItems(page).nth(2).waitFor({ state: 'visible' });

		// Disable gridster's CSS transitions so position reads are not mid-animation
		await page.addStyleTag({ content: 'gridster-item { transition: none !important; }' });

		await enterEditMode(page);
		// With 3 charts: item0 and item2 are side-by-side in row 0, item1 is in row 1
		const firstItem = getChartWidgetItems(page).first();
		const adjacentItem = getChartWidgetItems(page).nth(2);

		const adjacentBoxBefore = await adjacentItem.boundingBox();
		const resizeHandle = getChartWidgetResizeHandle(firstItem);
		const handleBox = await resizeHandle.boundingBox();
		expect(handleBox).not.toBeNull();

		await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
		await page.mouse.down();
		await page.mouse.move(handleBox!.x + 900, handleBox!.y + handleBox!.height / 2, { steps: 20 });
		await page.mouse.up();

		const adjacentBoxAfter = await adjacentItem.boundingBox();
		expect(adjacentBoxAfter).not.toBeNull();
		expect(adjacentBoxAfter!.y).toBeGreaterThan(adjacentBoxBefore!.y);
	});

	test('should not trigger PUT request during resize', async ({ page }) => {
		await enterEditMode(page);
		const firstItem = getChartWidgetItems(page).first();
		const resizeHandle = getChartWidgetResizeHandle(firstItem);
		const handleBox = await resizeHandle.boundingBox();

		await assertNoPutSent(page, async () => {
			await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
			await page.mouse.down();
			await page.mouse.move(handleBox!.x + 400, handleBox!.y + handleBox!.height / 2, { steps: 15 });
			await page.mouse.up();
		});
	});
});

// Edit mode exit - cancel
test.describe('Statistics - edit mode exit (cancel)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addNonFilterableChart(page);
		await getChartWidgetItems(page).first().waitFor({ state: 'visible' });
	});

	test('should send GET layout request on cancel and exit edit mode', async ({ page }) => {
		await enterEditMode(page);
		const [request] = await Promise.all([waitForLayoutGet(page), getCancelBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getCancelBtn(page)).not.toBeVisible();
		await expect(getMoreBtn(page)).toBeVisible();
	});

	test('should revert edited widget title on cancel', async ({ page }) => {
		const originalTitle = statisticsData.widgets.savingsRateGauge.title;
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await fillAndBlur(getEditChartTitleInput(page), 'Temporary Title');
		await getEditChartSaveBtn(page).click();
		await expect(getEditChartDialog(page)).not.toBeVisible();

		const [request] = await Promise.all([waitForLayoutGet(page), getCancelBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getMoreBtn(page)).toBeVisible();
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await expect(getEditChartTitleInput(page)).toHaveValue(originalTitle);
		await getEditChartCancelBtn(page).click();
	});

	test('should restore deleted widget on cancel', async ({ page }) => {
		await enterEditMode(page);
		await getChartWidgetDeleteBtns(page).first().click();
		await expect(getChartWidgetItems(page)).toHaveCount(0);

		const [request] = await Promise.all([waitForLayoutGet(page), getCancelBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getChartWidgetItems(page)).toHaveCount(1);
	});

	test('should restore original drag order on cancel', async ({ page }) => {
		await addNonFilterableChart(page, 'Chart Two');
		await getChartWidgetItems(page).nth(1).waitFor({ state: 'visible' });
		await enterEditMode(page);

		const items = getChartWidgetItems(page);
		const firstXOriginal = (await items.nth(0).boundingBox())!.x;
		const draggers = getChartWidgetDraggers(page);
		const firstDraggerBox = await draggers.nth(0).boundingBox();
		const secondDraggerBox = await draggers.nth(1).boundingBox();

		await page.mouse.move(
			firstDraggerBox!.x + firstDraggerBox!.width / 2,
			firstDraggerBox!.y + firstDraggerBox!.height / 2,
		);
		await page.mouse.down();
		await page.waitForTimeout(200);
		await page.mouse.move(
			secondDraggerBox!.x + secondDraggerBox!.width / 2,
			secondDraggerBox!.y + secondDraggerBox!.height / 2,
			{ steps: 20 },
		);
		await page.mouse.up();

		const [request] = await Promise.all([waitForLayoutGet(page), getCancelBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getMoreBtn(page)).toBeVisible();
		const firstXAfterCancel = (await items.nth(0).boundingBox())!.x;
		expect(Math.abs(firstXAfterCancel - firstXOriginal)).toBeLessThan(50);
	});

	test('should restore original chart size on cancel', async ({ page }) => {
		await addNonFilterableChart(page, 'Chart Two');
		await getChartWidgetItems(page).nth(1).waitFor({ state: 'visible' });
		await addNonFilterableChart(page, 'Chart Three');
		await getChartWidgetItems(page).nth(2).waitFor({ state: 'visible' });

		// Disable gridster's CSS transitions so position reads are not mid-animation
		await page.addStyleTag({ content: 'gridster-item { transition: none !important; }' });

		await enterEditMode(page);

		// With 3 charts: item0 and item2 are side-by-side in row 0
		const firstItem = getChartWidgetItems(page).first();
		const originalBox = await firstItem.boundingBox();
		const resizeHandle = getChartWidgetResizeHandle(firstItem);
		const handleBox = await resizeHandle.boundingBox();

		await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
		await page.mouse.down();
		await page.mouse.move(handleBox!.x + 600, handleBox!.y + handleBox!.height / 2, { steps: 20 });
		await page.mouse.up();

		const resizedBox = await firstItem.boundingBox();
		expect(resizedBox!.width).toBeGreaterThan(originalBox!.width + 50);

		const [request] = await Promise.all([waitForLayoutGet(page), getCancelBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getMoreBtn(page)).toBeVisible();
		const restoredBox = await firstItem.boundingBox();
		expect(restoredBox).not.toBeNull();
		expect(Math.abs(restoredBox!.width - originalBox!.width)).toBeLessThan(50);
	});
});

// Edit mode exit - save
test.describe('Statistics - edit mode exit (save)', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupStatisticsWithCategory(page, context);
		await addNonFilterableChart(page);
		await getChartWidgetItems(page).first().waitFor({ state: 'visible' });
	});

	test('should send PUT layout request on save and exit edit mode', async ({ page }) => {
		await enterEditMode(page);
		const [request] = await Promise.all([waitForLayoutPut(page), getSaveBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getSaveBtn(page)).not.toBeVisible();
		await expect(getMoreBtn(page)).toBeVisible();
	});

	test('should persist edited widget title after save', async ({ page }) => {
		const newTitle = 'Persisted Title';
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await fillAndBlur(getEditChartTitleInput(page), newTitle);
		await getEditChartSaveBtn(page).click();
		await expect(getEditChartDialog(page)).not.toBeVisible();

		const [request] = await Promise.all([waitForLayoutPut(page), getSaveBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getMoreBtn(page)).toBeVisible();
		await enterEditMode(page);
		await getChartWidgetEditBtns(page).first().click();
		await expect(getEditChartTitleInput(page)).toHaveValue(newTitle);
		await getEditChartCancelBtn(page).click();
	});

	test('should keep deleted widget hidden after save', async ({ page }) => {
		await enterEditMode(page);
		await getChartWidgetDeleteBtns(page).first().click();
		await expect(getChartWidgetItems(page)).toHaveCount(0);

		const [request] = await Promise.all([waitForLayoutPut(page), getSaveBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getChartWidgetItems(page)).toHaveCount(0);
	});

	test('should keep drag order after save', async ({ page }) => {
		await addNonFilterableChart(page, 'Chart Two');
		await getChartWidgetItems(page).nth(1).waitFor({ state: 'visible' });
		await enterEditMode(page);

		const items = getChartWidgetItems(page);
		const draggers = getChartWidgetDraggers(page);
		const firstDraggerBox = await draggers.nth(0).boundingBox();
		const secondDraggerBox = await draggers.nth(1).boundingBox();

		await page.mouse.move(
			firstDraggerBox!.x + firstDraggerBox!.width / 2,
			firstDraggerBox!.y + firstDraggerBox!.height / 2,
		);
		await page.mouse.down();
		await page.waitForTimeout(200);
		await page.mouse.move(
			secondDraggerBox!.x + secondDraggerBox!.width / 2,
			secondDraggerBox!.y + secondDraggerBox!.height / 2,
			{ steps: 20 },
		);
		await page.mouse.up();

		const firstXAfterDrag = (await items.nth(0).boundingBox())!.x;
		const [request] = await Promise.all([waitForLayoutPut(page), getSaveBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getMoreBtn(page)).toBeVisible();

		const firstXAfterSave = (await items.nth(0).boundingBox())!.x;
		expect(Math.abs(firstXAfterSave - firstXAfterDrag)).toBeLessThan(50);
	});

	test('should keep resized chart size after save', async ({ page }) => {
		await addNonFilterableChart(page, 'Chart Two');
		await getChartWidgetItems(page).nth(1).waitFor({ state: 'visible' });
		await addNonFilterableChart(page, 'Chart Three');
		await getChartWidgetItems(page).nth(2).waitFor({ state: 'visible' });

		// Disable gridster's CSS transitions so position reads are not mid-animation
		await page.addStyleTag({ content: 'gridster-item { transition: none !important; }' });

		await enterEditMode(page);

		// With 3 charts: item0 and item2 are side-by-side in row 0
		const firstItem = getChartWidgetItems(page).first();
		const originalBox = await firstItem.boundingBox();
		const resizeHandle = getChartWidgetResizeHandle(firstItem);
		const handleBox = await resizeHandle.boundingBox();

		await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
		await page.mouse.down();
		await page.mouse.move(handleBox!.x + 600, handleBox!.y + handleBox!.height / 2, { steps: 20 });
		await page.mouse.up();

		const resizedBox = await firstItem.boundingBox();
		expect(resizedBox!.width).toBeGreaterThan(originalBox!.width + 50);

		const [request] = await Promise.all([waitForLayoutPut(page), getSaveBtn(page).click()]);
		expect(request).toBeTruthy();
		await expect(getMoreBtn(page)).toBeVisible();

		const boxAfterSave = await firstItem.boundingBox();
		expect(boxAfterSave).not.toBeNull();
		expect(Math.abs(boxAfterSave!.width - resizedBox!.width)).toBeLessThan(50);
	});
});
