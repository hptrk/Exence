export const getByTestId = (el: HTMLElement, testId: string): Element | null =>
	el.querySelector(`[data-testid="${testId}"]`);

export const getAllByTestId = (el: HTMLElement, testId: string): NodeListOf<Element> =>
	el.querySelectorAll(`[data-testid="${testId}"]`);
