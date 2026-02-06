import { AfterViewInit, booleanAttribute, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
	selector: '[ex-card-slider]',
})
export class CardSliderDirective implements AfterViewInit {
	private elementRef = inject(ElementRef<HTMLElement>);
	private destroyRef = inject(DestroyRef);
	private resizeObserver?: ResizeObserver;

	private isOverFlowing = false;
	private minRequiredWidth = 0;

	shortCards = input(false, { transform: booleanAttribute });

	ngAfterViewInit(): void {
		this.calculateMinRequiredWidth();
		this.checkOverFlow();

		this.resizeObserver = new ResizeObserver(() => {
			this.checkOverFlow();
		});

		const el: HTMLElement = this.elementRef.nativeElement;
		const parent = el.parentElement;

		if (parent) {
			this.resizeObserver.observe(el);
			this.resizeObserver.observe(parent);
		}

		this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
	}

	private calculateMinRequiredWidth(): void {
		const el: HTMLElement = this.elementRef.nativeElement;
		const children = Array.from(el.children) as HTMLElement[];

		if (!children.length) return;

		const computedStyle = window.getComputedStyle(el);
		const gap = parseFloat(computedStyle.gap) || 0;

		let minWidthForNoScroll = 0;
		children.forEach((child) => {
			const childStyle = window.getComputedStyle(child);
			const minWidth = parseFloat(childStyle.minWidth) || child.offsetWidth;
			minWidthForNoScroll += minWidth;
		});
		minWidthForNoScroll += gap * (children.length - 1);

		// buffer for padding/margin
		this.minRequiredWidth =
			minWidthForNoScroll + parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
	}

	private checkOverFlow(): void {
		const el: HTMLElement = this.elementRef.nativeElement;
		const parent = el.parentElement;

		if (!parent) return;

		const canFitNaturally = parent.clientWidth >= this.minRequiredWidth;
		this.isOverFlowing = el.scrollWidth > parent.clientWidth;

		const children = Array.from(el.children);
		const classes = ['overflow-x-auto', 'pb-1'];

		if (this.isOverFlowing && !canFitNaturally) {
			el.classList.add(...classes);
			children.forEach((c) => {
				if (this.shortCards()) {
					(c as HTMLElement).style.minWidth = '90%';
				} else {
					(c as HTMLElement).style.minWidth = '45%';
				}
			});
		} else {
			el.classList.remove(...classes);
			children.forEach((c) => {
				(c as HTMLElement).style.flex = '1 1 0';
				(c as HTMLElement).style.minWidth = 'auto';
			});
		}
	}
}
