import { booleanAttribute, Component, inject, input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'ex-dialog-card',
	templateUrl: './dialog-card.component.html',
	styleUrl: './dialog-card.component.scss',
	imports: [ButtonComponent],
})
export class DialogCardComponent {
	private readonly matDialogRef = inject(MatDialogRef, { optional: true });

	hideCloseButton = input(false, { transform: booleanAttribute });

	onCloseClick(): void {
		this.matDialogRef?.close();
	}
}
