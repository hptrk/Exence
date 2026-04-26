import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'ex-input-clear',
	template: `
		@if (control().value && control().enabled) {
			<button
				data-testid="clear-btn"
				mat-icon-button
				type="button"
				[disabled]="control().disabled"
				(click)="clear()"
				tabindex="-1"
			>
				<mat-icon>close</mat-icon>
			</button>
		}
	`,
	imports: [MatButtonModule, MatIconModule],
})
export class InputClearButtonComponent {
	control = input.required<FormControl>();

	clear(): void {
		if (this.control().defaultValue) {
			this.control().setValue(null);
		} else {
			this.control().reset();
		}
	}
}
