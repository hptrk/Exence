import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoService } from '@jsverse/transloco';
import { marked } from 'marked';
import { AdminEmailService } from '../admin-email.service';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { MarkdownEditorComponent } from '../../../shared/markdown-editor/markdown-editor.component';
import {
	MessageDialogButtonConfig,
	MessageDialogComponent,
} from '../../../shared/message-dialog/message-dialog.component';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'ex-email-broadcast',
	templateUrl: './email-broadcast.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatTooltipModule,
		MatInput,
		ButtonComponent,
		InputClearButtonComponent,
		ValidatorComponent,
		AutoTrimDirective,
		TranslatePipe,
		MarkdownEditorComponent,
	],
	providers: [AdminEmailService],
})
export class EmailBroadcastComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly adminEmailService = inject(AdminEmailService);
	private readonly dialogService = inject(DialogService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);

	readonly sending = signal(false);

	form = this.fb.group({
		subject: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		content: this.fb.control<string>('', [Validators.maxLength(2000)]),
	});

	clear(): void {
		this.form.controls.content.reset();
	}

	async send(): Promise<void> {
		if (this.sending()) return;
		this.sending.set(true);

		try {
			const confirmed = await this.dialogService.openNonModal(MessageDialogComponent, {
				title: this.translocoService.translate('admin.configurations.emailBroadcast.confirmTitle'),
				message: this.translocoService.translate('admin.configurations.emailBroadcast.confirmMessage'),
				hideCloseIcon: false,
				buttons: MessageDialogButtonConfig.custom(
					{
						text: this.translocoService.translate('admin.configurations.emailBroadcast.send'),
						value: true,
						matIcon: 'mail',
						color: 'primary',
					},
					{
						text: this.translocoService.translate('literals.cancel'),
						value: false,
						matIcon: 'close',
						color: 'accent',
					},
				),
			});

			if (!confirmed) return;

			const htmlContent = await marked.parse(this.form.controls.content.value);
			await this.adminEmailService.sendBroadcastEmail({
				subject: this.form.controls.subject.value,
				htmlContent,
			});
			this.snackbarService.showSuccess(
				this.translocoService.translate('admin.configurations.emailBroadcast.success'),
			);
			this.form.reset();
		} finally {
			this.sending.set(false);
		}
	}
}
