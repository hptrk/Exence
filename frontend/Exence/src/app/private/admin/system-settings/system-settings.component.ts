import { Component, inject, resource, signal } from '@angular/core';
import { toRawValueSignal } from '../../../shared/util/utils';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@jsverse/transloco';
import { SystemSettingsPatchRequest } from '../../../data-model/modules/admin/SystemSettingsPatchRequest';
import { AmountStepperComponent } from '../../../shared/amount-stepper/amount-stepper.component';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { ToggleCardComponent } from '../../../shared/toggle-card/toggle-card.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { AdminSettingsService } from '../admin-settings.service';
import { AddPathDialogComponent } from './add-path-dialog/add-path-dialog.component';

@Component({
	selector: 'ex-system-settings',
	templateUrl: './system-settings.component.html',
	styleUrl: './system-settings.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatChipsModule,
		MatIconModule,
		MatTooltipModule,
		AmountStepperComponent,
		AnimatedSkeletonLoaderComponent,
		ToggleCardComponent,
		ButtonComponent,
		TranslatePipe,
	],
	providers: [AdminSettingsService],
})
export class SystemSettingsComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly adminSettingsService = inject(AdminSettingsService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);
	private readonly dialogService = inject(DialogService);

	readonly saving = signal(false);
	readonly verificationPaths = signal<string[]>([]);

	readonly form = this.fb.group({
		domainWhitelistOnly: this.fb.control<boolean>(false),
		rateLimitingEnabled: this.fb.control<boolean>(false),
		rateLimitingCooldownMinutes: this.fb.control<number>(1, [Validators.required, Validators.min(1)]),
		logoutFromAllDevices: this.fb.control<boolean>(false),
		passwordHistoryCount: this.fb.control<number>(0, [Validators.required, Validators.min(0)]),
	});
	readonly formValue = toRawValueSignal(this.form);

	readonly settingsResource = resource({
		loader: async () => {
			const settings = await this.adminSettingsService.getSettings();
			this.verificationPaths.set(settings.verificationRequiredPaths);
			this.form.patchValue({
				domainWhitelistOnly: settings.domainWhitelistOnly,
				rateLimitingEnabled: settings.rateLimitingEnabled,
				rateLimitingCooldownMinutes: settings.rateLimitingCooldownMinutes,
				logoutFromAllDevices: settings.logoutFromAllDevices,
				passwordHistoryCount: settings.passwordHistoryCount,
			});
			return settings;
		},
	});

	async openAddPathDialog(): Promise<void> {
		const path = await this.dialogService.openNonModal<undefined, string | null>(AddPathDialogComponent, undefined);
		if (path && !this.verificationPaths().includes(path)) {
			this.verificationPaths.update(paths => [...paths, path]);
		}
	}

	removePath(path: string): void {
		this.verificationPaths.update(paths => paths.filter(p => p !== path));
	}

	cancel(): void {
		this.settingsResource.reload();
	}

	async save(): Promise<void> {
		if (this.saving() || this.form.invalid) return;
		this.saving.set(true);

		try {
			const formValue = this.form.getRawValue();
			const request: SystemSettingsPatchRequest = {
				domainWhitelistOnly: formValue.domainWhitelistOnly,
				verificationRequiredPaths: this.verificationPaths(),
				rateLimitingEnabled: formValue.rateLimitingEnabled,
				rateLimitingCooldownMinutes: formValue.rateLimitingCooldownMinutes,
				logoutFromAllDevices: formValue.logoutFromAllDevices,
				passwordHistoryCount: formValue.passwordHistoryCount,
			};
			const updated = await this.adminSettingsService.updateSettings(request);
			this.verificationPaths.set(updated.verificationRequiredPaths);
			this.snackbarService.showSuccess(
				this.translocoService.translate('admin.configurations.systemSettings.success'),
			);
		} finally {
			this.saving.set(false);
		}
	}
}
