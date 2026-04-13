import { Component, effect, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseComponent } from '../base-component/base.component';
import { TranslationCode } from '../i18n/translation-types';
import { InfoButtonComponent } from '../info-button/info-button.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { SvgIcons } from '../svg-icons/svg-icons';

@Component({
	selector: 'ex-toggle-card',
	templateUrl: './toggle-card.component.html',
	styleUrl: './toggle-card.component.scss',
	imports: [ReactiveFormsModule, MatIconModule, MatSlideToggleModule, InfoButtonComponent, TranslatePipe],
	host: {
		'[class.active]': 'value()',
	},
})
export class ToggleCardComponent extends BaseComponent {
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	label = input.required<TranslationCode>();
	description = input.required<TranslationCode>();
	tooltip = input.required<TranslationCode>();
	value = model<boolean>(false);

	control = new FormControl<boolean>(false, { nonNullable: true });

	constructor() {
		super();

		effect(() => this.control.setValue(this.value(), { emitEvent: false }));

		this.addSubscription(this.control.valueChanges.subscribe(v => this.value.set(v)));
	}
}
