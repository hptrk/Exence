import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgIcons } from '../svg-icons/svg-icons';
import { SnackbarType } from './snackbar.service';

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

export const SNACKBAR_DISMISS_DURATION = 5000;

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
	private readonly snackbarRef = inject(MatSnackBarRef<SnackbarComponent>);
	private readonly destroyRef = inject(DestroyRef);
	readonly data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);

	private animationFrameId?: number;

	readonly errorType = SnackbarType.Error;
	readonly warnType = SnackbarType.Warning;
	readonly infoType = SnackbarType.Info;
	readonly successType = SnackbarType.Success;
	
	progress = signal<number>(0);
	fadeOutStarted = signal<boolean>(false);

	constructor() {
		this.startProgressAnimation();
		this.destroyRef.onDestroy(() => {
			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId);
			}
		});	
	}

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

	private startProgressAnimation(): void {
		const startTime = performance.now();

		const animate = (currentTime: number): void => {
			if (!startTime) return;

			const elapsed = currentTime - startTime;
			const progressValue = Math.min(elapsed, SNACKBAR_DISMISS_DURATION);
			const newProgress = Math.floor((progressValue / SNACKBAR_DISMISS_DURATION) * 100);

			this.progress.set(newProgress);

			if (progressValue >= SNACKBAR_DISMISS_DURATION - 300) {
				this.fadeOutStarted.set(true);
			}

			if (progressValue < SNACKBAR_DISMISS_DURATION) {
				this.animationFrameId = requestAnimationFrame(animate);
			}
		};

		this.animationFrameId = requestAnimationFrame(animate);
	}
}


