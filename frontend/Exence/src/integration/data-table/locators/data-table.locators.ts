import { getAllByTestId, getByTestId } from '../../utils/test-utils';

export const getTableTitle = (el: HTMLElement): Element | null => getByTestId(el, 'table-title');

export const getTableHeaderIcon = (el: HTMLElement): Element | null => getByTestId(el, 'table-header-icon');

export const getAddBtn = (el: HTMLElement): Element | null => getByTestId(el, 'add-btn');

export const getEmptyState = (el: HTMLElement): Element | null => getByTestId(el, 'empty-state');

export const getAllDataRows = (el: HTMLElement): NodeListOf<Element> => getAllByTestId(el, 'data-row');

export const getFooterRow = (el: HTMLElement): Element | null => getByTestId(el, 'footer-row');

export const getSkeletonLoader = (el: HTMLElement): Element | null => getByTestId(el, 'skeleton-loader');

export const getAllMenuTriggerBtns = (el: HTMLElement): NodeListOf<Element> => getAllByTestId(el, 'menu-trigger-btn');

export const getInlineActionBtns = (el: HTMLElement): NodeListOf<Element> => getAllByTestId(el, 'inline-action-btn');

export const getInlineActionNativeBtn = (el: HTMLElement, index: number): HTMLButtonElement =>
	getInlineActionBtns(el)[index].querySelector('[data-testid="icon-btn"]') as HTMLButtonElement;

export const getAllCustomCells = (el: HTMLElement): NodeListOf<Element> => getAllByTestId(el, 'custom-cell');
