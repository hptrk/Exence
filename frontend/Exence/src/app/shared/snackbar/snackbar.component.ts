import { Component, inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackbarType } from "./snackbar.service";
import { SvgIcons } from "../svg-icons/svg-icons";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";

export interface SnackbarData {
	message: string;
	type: SnackbarType;
	action?: {
		matIcon?: string;
		svgIcon?: SvgIcons;
		tooltip: string;
		onClick: () => void;
	};
}

@Component({
	selector: 'ex-snackbar',
	templateUrl: './snackbar.component.html',
	styleUrl: './snackbar.component.scss',
	imports: [
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
	],
})
export class SnackbarComponent {
	readonly data = inject(MAT_SNACK_BAR_DATA);
	private readonly snackbarRef = inject(MatSnackBarRef<SnackbarComponent>);

	readonly errorType = SnackbarType.Error;
	readonly warnType = SnackbarType.Warning;
	readonly infoType = SnackbarType.Info;
	readonly successType = SnackbarType.Success;
	
	getCssClass(): string {
		switch (this.data.type) {
			case SnackbarType.Error:
				return 'error';
			case SnackbarType.Warning:
				return 'warning';
			case SnackbarType.Success:
				return 'success';
			default:
				return '';
		}
	}

	onClose(): void {
		this.snackbarRef.dismiss();
	}
}


