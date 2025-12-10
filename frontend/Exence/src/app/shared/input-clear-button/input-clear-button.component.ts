import { Component, input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: 'ex-input-clear',
	template: `
		@if (control().value) {
			<button
				mat-icon-button
				[disabled]="control().disabled"
				(click)="clear()" tabindex="-1"
			>
				<mat-icon>close</mat-icon>
			</button>
		}
	`,
	imports: [MatButtonModule, MatIconModule]
})
export class InputClearButtonComponent {
	control = input.required<AbstractControl>();

	clear(): void {
		this.control().reset();
	}
}