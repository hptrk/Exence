import { getByTestId } from '../../utils/test-utils';

export const getCardContent = (el: HTMLElement): Element | null => getByTestId(el, 'card-content');

export const getSkeletonLoader = (el: HTMLElement): Element | null => getByTestId(el, 'skeleton-loader');

export const getSankeyChart = (el: HTMLElement): Element | null => getByTestId(el, 'sankey-chart');

export const getTimeframe = (el: HTMLElement): Element | null => getByTestId(el, 'timeframe');
