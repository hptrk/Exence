import { AfterContentInit, Directive, inject, input } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { BaseComponent } from './base-component/base.component';

@Directive({
	selector: '[selectAutoFocus]',
})
export class SelectAutoFocusDirective extends BaseComponent implements AfterContentInit {
	private readonly select = inject(MatSelect);
	focusedInput = input<HTMLInputElement>();

	ngAfterContentInit(): void {
		this.addSubscription(
			this.select._openedStream.subscribe(() => setTimeout(() => this.focusedInput()?.focus(), 0)),
		);
	}
}
