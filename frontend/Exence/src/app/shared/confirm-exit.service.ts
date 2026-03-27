import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogService } from './dialog/dialog.service';
import {
	MessageDialogButtonConfig,
	MessageDialogComponent,
	PredefiedButtons,
} from './message-dialog/message-dialog.component';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
	providedIn: 'root',
})
export class ConfirmExitService {
	private readonly dialog = inject(DialogService);
	private readonly translocoService = inject(TranslocoService);
	private trackedForms = new Set<FormGroup>();

	registerForm(form: FormGroup): void {
		this.trackedForms.add(form);
	}

	unregisterForm(form: FormGroup): void {
		this.trackedForms.delete(form);
	}

	hasChanges(): boolean {
		return Array.from(this.trackedForms).some(form => form.dirty);
	}

	async showConfirmDialog(): Promise<boolean> {
		return this.dialog.openModal(MessageDialogComponent, {
			title: this.translocoService.translate('confirmExit.title'),
			message: this.translocoService.translate('confirmExit.message'),
			hideCloseIcon: true,
			buttons: MessageDialogButtonConfig.custom(
				{
					text: this.translocoService.translate('literals.continue'),
					value: true,
					color: 'primary',
					iconPositionEnd: true,
					matIcon: 'chevron_forward',
				},
				PredefiedButtons.CANCEL,
			),
		});
	}
}
