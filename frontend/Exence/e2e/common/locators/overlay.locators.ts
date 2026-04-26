import { Locator, Page } from '@playwright/test';

export const getOverlayBackdrop = (page: Page): Locator => page.locator('.cdk-overlay-transparent-backdrop');
