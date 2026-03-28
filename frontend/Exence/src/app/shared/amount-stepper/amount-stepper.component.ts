import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../button/button.component';
import { ValidatorComponent } from '../validator/validator.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationCode } from '../i18n/translation-types';

@Component({
	selector: 'ex-amount-stepper',
	templateUrl: './amount-stepper.component.html',
	styleUrl: './amount-stepper.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		ButtonComponent,
		ValidatorComponent,
		TranslatePipe,
	],
})
export class AmountStepperComponent {
	control = input.required<FormControl<number | null>>();
	label = input<TranslationCode>();
	min = input<number>();
	max = input<number>();
	step = input<number>(100);
	subscriptSizing = input<'fixed' | 'dynamic'>('dynamic');

	isAtMin = computed(() => {
		const min = this.min();
		if (min === undefined) return false;
		const value = this.control().value;
		return value !== null && value <= min;
	});

	isAtMax = computed(() => {
		const max = this.max();
		if (max === undefined) return false;
		const value = this.control().value;
		return value !== null && value >= max;
	});

	hasValidators = computed(() => !!this.control().validator);
	labelFloat = computed<FloatLabelType>(() => (this.control().value !== null ? 'always' : 'auto'));

	decrement(): void {
		const next = (this.control().value ?? 0) - this.step();
		if (this.min() !== undefined && next < this.min()!) return;
		this.control().setValue(next);
		this.control().markAsDirty();
	}

	increment(): void {
		const next = (this.control().value ?? 0) + this.step();
		if (this.max() !== undefined && next > this.max()!) return;
		this.control().setValue(next);
		this.control().markAsDirty();
	}
}
