import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { bootstrapLg, bootstrapMd, bootstrapSm, bootstrapXl, bootstrapXxl } from '../common-components/util/contsants';

export type DisplaySizeBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

@Injectable({
	providedIn: 'root',
})
export class DisplaySizeService {
	private _isSm?: Observable<boolean>;
	private _isMd?: Observable<boolean>;
	private _isLg?: Observable<boolean>;
	private _isXl?: Observable<boolean>;
	private _isXxl?: Observable<boolean>;

	constructor(private readonly breakpointObserver: BreakpointObserver) {}

	get isSm(): Observable<boolean> {
		if (!this._isSm) {
			this._isSm = this.getObservable(bootstrapSm);
		}
		return this._isSm;
	}

	get isMd(): Observable<boolean> {
		if (!this._isMd) {
			this._isMd = this.getObservable(bootstrapMd);
		}
		return this._isMd;
	}

	get isLg(): Observable<boolean> {
		if (!this._isLg) {
			this._isLg = this.getObservable(bootstrapLg);
		}
		return this._isLg;
	}

	get isXl(): Observable<boolean> {
		if (!this._isXl) {
			this._isXl = this.getObservable(bootstrapXl);
		}
		return this._isXl;
	}

	get isXxl(): Observable<boolean> {
		if (!this._isXxl) {
			this._isXxl = this.getObservable(bootstrapXxl);
		}
		return this._isXxl;
	}

	public getObservable(breakpoint: number): Observable<boolean> {
		return this.breakpointObserver.observe(`(min-width: ${breakpoint}px)`).pipe(map(result => result.matches));
	}

	public getObservableByName(breakpoint: DisplaySizeBreakpoint): Observable<boolean> {
		switch (breakpoint) {
			case 'sm':
				return this.isSm;
			case 'md':
				return this.isMd;
			case 'lg':
				return this.isLg;
			case 'xl':
				return this.isXl;
			case 'xxl':
				return this.isXxl;
		}
	}
}
