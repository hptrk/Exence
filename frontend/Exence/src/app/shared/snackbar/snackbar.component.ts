import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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
	private startTime?: number;

	readonly errorType = SnackbarType.Error;
	readonly warnType = SnackbarType.Warning;
	readonly infoType = SnackbarType.Info;
	readonly successType = SnackbarType.Success;
	
	progress = signal<number>(0);
	progressPercent = computed(() => Math.floor((this.progress() / SNACKBAR_DISMISS_DURATION) * 100));


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
		this.startTime = performance.now();

		const animate = (currentTime: number): void => {
			if (!this.startTime) return;

			const elapsed = currentTime - this.startTime;
			const newProgress = Math.min(elapsed, SNACKBAR_DISMISS_DURATION);

			this.progress.set(newProgress);

			if (newProgress < SNACKBAR_DISMISS_DURATION) {
				this.animationFrameId = requestAnimationFrame(animate);
			}
		};

		this.animationFrameId = requestAnimationFrame(animate);
	}
}


