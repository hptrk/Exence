import { getByTestId } from '../../utils/test-utils';

export const getCreateBtn = (el: HTMLElement): Element | null => getByTestId(el, 'create-btn');

export const getRecurringConfig = (el: HTMLElement): Element | null => getByTestId(el, 'recurring-config');

export const getDayOfWeekSelector = (el: HTMLElement): Element | null => getByTestId(el, 'day-of-week-selector');

export const getDayOfMonthSelector = (el: HTMLElement): Element | null => getByTestId(el, 'day-of-month-selector');
