import { booleanAttribute, Component, input } from "@angular/core";
import { ButtonComponent } from "../button/button.component";
import { MatDialogClose } from "@angular/material/dialog";

@Component({
	selector: 'ex-dialog-card',
	templateUrl: './dialog-card.component.html',
	styleUrl: './dialog-card.component.scss',
	imports: [
		MatDialogClose,
		ButtonComponent,
	],
})
export class DialogCardComponent {
	hideCloseButton = input(false, { transform: booleanAttribute });
}