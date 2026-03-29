import { Component, computed, input, output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from '../button/button.component';
import { TranslationCode } from '../i18n/translation-types';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
	selector: 'ex-show-password',
	template: `
		@if (control().value) {
			<ex-button
				iconButton
				color="accent"
				[matTooltip]="codeForTogglePassword() | translate"
				[matIcon]="showPassword() ? 'visibility_off' : 'visibility'"
				(click)="toggled.emit()"
			/>
		}
	`,
	imports: [MatTooltipModule, ButtonComponent, TranslatePipe],
})
export class ShowPasswordComponent {
	showPassword = input.required<boolean>();
	control = input.required<AbstractControl>();

	readonly toggled = output();

	codeForTogglePassword = computed<TranslationCode>(() =>
		this.showPassword() ? 'passwordVisibility.hide' : 'passwordVisibility.show',
	);
}
