import { Component } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
import { DialogCardComponent } from "../dialog-card/dialog-card.component";
import { DialogComponent } from "../dialog/dialog.service";
import { SvgIcons } from "../svg-icons/svg-icons";
import { MatDialogClose } from "@angular/material/dialog";

enum PredefinedButtonNames{
	OK = 'OK',
	CANCEL = 'CANCEL',
	DELETE = 'DELETE',
}

export const PredefiedButtons: Record<PredefinedButtonNames, MessageDialogButtonData> = {
	OK: { text: 'Ok', value: true, matIcon: 'check', color: 'primary' },
	CANCEL: { text: 'Cancel', value: false, matIcon: 'close', color: 'accent' },
	DELETE: { text: 'Delete', value: true, matIcon: 'delete', color: 'error' },
}

export interface MessageDialogButtonData {
	text: string;
	value: boolean;
	color: 'primary' | 'accent' | 'success' | 'error' | 'warn';
	svgIcon?: SvgIcons;
	matIcon?: string;
	iconPositionEnd?: true;
}

export interface MessageDialogData {
	title: string;
	message: string;
	hideCloseIcon: boolean;
	buttons: MessageDialogButtonConfig;
}

export class MessageDialogButtonConfig {
	public static ok = new MessageDialogButtonConfig(PredefiedButtons.OK);
	public static okCancel = new MessageDialogButtonConfig(PredefiedButtons.CANCEL, PredefiedButtons.OK);
	public static delete = new MessageDialogButtonConfig(PredefiedButtons.DELETE);
	public static deleteCancel = new MessageDialogButtonConfig(PredefiedButtons.CANCEL, PredefiedButtons.DELETE);

	readonly buttons: MessageDialogButtonData[];
	constructor(...buttons: MessageDialogButtonData[]) { this.buttons = buttons; }

	static custom(primaryButton: MessageDialogButtonData, secondaryButton?: MessageDialogButtonData): MessageDialogButtonConfig {
		if (secondaryButton) return new MessageDialogButtonConfig(secondaryButton, primaryButton);
		return new MessageDialogButtonConfig(primaryButton);
	}
}

@Component({
	selector: 'ex-message-dialog',
	templateUrl: './message-dialog.component.html',
	imports: [
    DialogCardComponent,
    ButtonComponent,
    MatDialogClose
],
})
export class MessageDialogComponent extends DialogComponent<MessageDialogData, boolean> {
	actions = this.dialogRef.value.buttons ?? MessageDialogButtonConfig.okCancel;
}