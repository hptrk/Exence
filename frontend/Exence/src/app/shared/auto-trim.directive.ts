import { Directive, inject } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

function trimValueAccessor(valueAccessor: ControlValueAccessor): void {
	const original = valueAccessor.registerOnChange;

	// overrides angular's formControl updation function to first validate strings
	valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
		return original.call(valueAccessor, (value: unknown) => {
			return fn(typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value);
		});
	};
}

@Directive({
	selector: '[autoTrim]',
	standalone: true,
})
export class AutoTrimDirective {
	private control = inject(NgControl);

	constructor() {
		trimValueAccessor(this.control.valueAccessor!);
	}
}
