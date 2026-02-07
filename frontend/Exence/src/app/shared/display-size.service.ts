import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { bootstrapLg, bootstrapMd, bootstrapSm, bootstrapXl, bootstrapXxl } from './util/constants';

export type DisplaySizeBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const BREAKPOINT_VALUES: Readonly<Record<DisplaySizeBreakpoint, number>> = {
	sm: bootstrapSm,
	md: bootstrapMd,
	lg: bootstrapLg,
	xl: bootstrapXl,
	xxl: bootstrapXxl,
};

@Injectable({
	providedIn: 'root',
})
export class DisplaySizeService {
	private breakpointObserver = inject(BreakpointObserver);
	private destroyRef = inject(DestroyRef);

	private initializedSignals = new Map<DisplaySizeBreakpoint, Signal<boolean>>();
	private subscriptions: Subscription[] = [];

	get isSm(): Signal<boolean> {
		return this.createOrGetBreakPointSignal('sm');
	}

	get isMd(): Signal<boolean> {
		return this.createOrGetBreakPointSignal('md');
	}

	get isLg(): Signal<boolean> {
		return this.createOrGetBreakPointSignal('lg');
	}

	get isXl(): Signal<boolean> {
		return this.createOrGetBreakPointSignal('xl');
	}

	get isXxl(): Signal<boolean> {
		return this.createOrGetBreakPointSignal('xxl');
	}

	constructor() {
		this.destroyRef.onDestroy(() => {
			this.subscriptions.forEach(sub => sub.unsubscribe());
		});
	}

	public getObserverByName(
		breakpoint: DisplaySizeBreakpoint | Signal<DisplaySizeBreakpoint | undefined>,
	): Signal<boolean> {
		if (typeof breakpoint === 'function') {
			return computed(() => {
				const name = breakpoint();
				if (!name) return true;
				return this.createOrGetBreakPointSignal(name)();
			});
		}
		return this.createOrGetBreakPointSignal(breakpoint);
	}

	private createOrGetBreakPointSignal(breakpoint: DisplaySizeBreakpoint): Signal<boolean> {
		if (this.initializedSignals.has(breakpoint)) {
			return this.initializedSignals.get(breakpoint)!;
		}

		const breakpointPx = BREAKPOINT_VALUES[breakpoint];
		const initialMatch = this.breakpointObserver.isMatched(`(min-width: ${breakpointPx}px)`);
		const sig = signal<boolean>(initialMatch);

		queueMicrotask(() => {
			const subscription = this.breakpointObserver.observe(`(min-width: ${breakpointPx}px)`).subscribe(result => {
				sig.set(result.matches);
			});

			this.subscriptions.push(subscription);
		});

		this.initializedSignals.set(breakpoint, sig.asReadonly());
		return sig.asReadonly();
	}
}
