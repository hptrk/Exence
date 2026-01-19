import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, SimpleSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_DISMISS_DURATION, SnackbarComponent, SnackbarData } from './snackbar.component';

export const enum SnackbarType {
	Error,
	Warning,
	Info,
	Success
}

@Injectable({
	providedIn: 'root'
})
export class SnackbarService {
	private readonly snackbar = inject(MatSnackBar);

	private readonly snackbarConfig: MatSnackBarConfig<SimpleSnackBar> = {
		panelClass: 'custom-snackbar'
	};

	showCustom(data: SnackbarData): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data,
			duration: SNACKBAR_DISMISS_DURATION,
		});
	}

	showError(message: string): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data: {
				message,
				type: SnackbarType.Error
			} satisfies SnackbarData,
			duration: SNACKBAR_DISMISS_DURATION,
		});
	}

	showWarning(message: string): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data: {
				message,
				type: SnackbarType.Warning
			} satisfies SnackbarData,
			duration: SNACKBAR_DISMISS_DURATION,
		});
	}

	showInfo(message: string): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data: {
				message,
				type: SnackbarType.Info
			} satisfies SnackbarData,
			duration: SNACKBAR_DISMISS_DURATION,
		});
	}

	showSuccess(message: string): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data: {
				message,
				type: SnackbarType.Success
			} satisfies SnackbarData,
			duration: SNACKBAR_DISMISS_DURATION,
		});
	}
}