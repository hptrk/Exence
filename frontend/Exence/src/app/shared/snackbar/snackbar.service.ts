import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, SimpleSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_DISMISS_DURATION, SnackbarComponent, SnackbarData } from './snackbar.component';

export const enum SnackbarType {
	Error = 'error',
	Warning = 'warning',
	Info = 'info',
	Success = 'success',
}

@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	private readonly snackbar = inject(MatSnackBar);

	private snackbarConfig: MatSnackBarConfig<SimpleSnackBar> = {
		panelClass: 'custom-snackbar',
		duration: SNACKBAR_DISMISS_DURATION,
		horizontalPosition: 'right',
		verticalPosition: 'top',
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
				type: SnackbarType.Error,
			} satisfies SnackbarData,
		});
	}

	showWarning(message: string): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data: {
				message,
				type: SnackbarType.Warning,
			} satisfies SnackbarData,
		});
	}

	showInfo(message: string): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data: {
				message,
				type: SnackbarType.Info,
			} satisfies SnackbarData,
		});
	}

	showSuccess(message: string): void {
		this.snackbar.openFromComponent(SnackbarComponent, {
			...this.snackbarConfig,
			data: {
				message,
				type: SnackbarType.Success,
			} satisfies SnackbarData,
		});
	}
}
