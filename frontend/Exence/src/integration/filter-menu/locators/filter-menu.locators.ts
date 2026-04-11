// `.mat-badge-hidden` is an Angular Material internal class — no data-testid alternative is possible
export const getHiddenBadge = (el: HTMLElement): Element | null => el.querySelector('.mat-badge-hidden');
