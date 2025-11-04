import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SvgIcons } from '../svg-icons/svg-icons';

@Injectable({
	providedIn: 'root'
})
export abstract class BaseComponent implements OnDestroy {
	svgIcons = SvgIcons;

	private readonly _subscriptions: Subscription[] = [];

	ngOnDestroy(): void {
		this._subscriptions.forEach(a => a.unsubscribe());
	}

	addSubscription(s: Subscription): void {
		this._subscriptions.push(s);
	}
}
