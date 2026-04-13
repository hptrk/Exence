import { getAllByTestId, getByTestId } from '../../utils/test-utils';

// NoteBoxComponent
export const getNoteIcon = (el: HTMLElement): Element | null => getByTestId(el, 'note-icon');

// InputClearButtonComponent
export const getClearBtn = (el: HTMLElement): Element | null => getByTestId(el, 'clear-btn');

// ButtonComponent
export const getIconBtn = (el: HTMLElement): Element | null => getByTestId(el, 'icon-btn');
export const getRegularBtn = (el: HTMLElement): Element | null => getByTestId(el, 'btn');
export const getNativeBtn = (el: HTMLElement): HTMLButtonElement | null =>
	(getIconBtn(el) ?? getRegularBtn(el)) as HTMLButtonElement | null;

// ShowPasswordComponent
export const getTogglePasswordBtn = (el: HTMLElement): Element | null => getByTestId(el, 'toggle-password-btn');
export const clickTogglePasswordBtn = (el: HTMLElement): void => {
	(getTogglePasswordBtn(el) as HTMLElement).click();
};

// DialogCardComponent
export const getCloseBtn = (el: HTMLElement): Element | null => getByTestId(el, 'close-btn');

// MessageDialogComponent
export const getAllActionBtns = (el: HTMLElement): NodeListOf<Element> => getAllByTestId(el, 'action-btn');

// InfoButtonComponent
export const getInfoBtn = (el: HTMLElement): Element | null => getByTestId(el, 'info-btn');
