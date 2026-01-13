import { inject, Injectable } from "@angular/core";
import { DialogService } from "./dialog/dialog.service";
import { MessageDialogButtonConfig, MessageDialogComponent, PredefiedButtons } from "./message-dialog/message-dialog.component";

@Injectable({
	providedIn: 'root'
})
export class ConfirmExitService {
	private readonly dialog = inject(DialogService);

	async showConfirmDialog(): Promise<boolean> {
		return this.dialog.openModal(MessageDialogComponent, {
			title: 'Unsaved changes',
			message: 'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
			hideCloseIcon: true,
			buttons: MessageDialogButtonConfig.custom(
				{
					text: 'Continue',
					value: true,
					color: 'primary',
					iconPositionEnd: true,
					matIcon: 'chevron_forward',
				},
				PredefiedButtons.CANCEL,
			)
		});
	}
}