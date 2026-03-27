import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { pairwise } from 'rxjs';
import { CategorizedMaterialIcons, MaterialIcon } from '../../data-model/modules/category/MaterialIcon';
import { BaseComponent } from '../base-component/base.component';
import { ButtonComponent } from '../button/button.component';
import { EnumValuePipe } from '../pipes/enum-value.pipe';
import { StopPropagationDirective } from '../stop-propagation.directive';
import { toRawValueSignal } from '../util/utils';
import { TranslocoPipe } from '@jsverse/transloco';

export interface CategoryIconInfo {
	icon: MaterialIcon;
	color: string;
}

enum PredefinedIconColors {
	yellow = 'yellow',
	brown = 'brown',
	red = 'red',
	pink = 'pink',
	purple = 'purple',
	blue = 'blue',
	turquoise = 'turquoise',
	green = 'green',
	gray = 'gray',
}

@Component({
	selector: 'ex-icon-picker',
	templateUrl: './icon-picker.component.html',
	styleUrl: './icon-picker.component.scss',
	imports: [
		MatIconModule,
		ReactiveFormsModule,
		CommonModule,
		MatMenuModule,
		MatTooltipModule,
		ButtonComponent,
		EnumValuePipe,
		TranslocoPipe,
		StopPropagationDirective,
	],
})
export class IconPickerComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly menuTrigger = viewChild.required<MatMenuTrigger>('menuTrigger');

	DEFAULT_CUSTOM_BACKGROUND =
		'linear-gradient(to RIGHT bottom, #FF0000 5%, #F9D300 30%, #00FF00 45%, #003CFF 65%, #791EFF 70%, #F200FF 100%)' as const;

	icon = input<MaterialIcon>();
	color = input<PredefinedIconColors | string>();

	readonly closed = output<CategoryIconInfo>();

	predefinedColors = PredefinedIconColors;
	categorizedMaterialIcons = CategorizedMaterialIcons;
	predefinedIconColorsData: Record<PredefinedIconColors, string> = {
		[PredefinedIconColors.yellow]: '#FFB300',
		[PredefinedIconColors.brown]: '#A67C52',
		[PredefinedIconColors.red]: '#FF4500',
		[PredefinedIconColors.pink]: '#F06292',
		[PredefinedIconColors.purple]: '#BA68C8',
		[PredefinedIconColors.blue]: '#4FC3F7',
		[PredefinedIconColors.turquoise]: '#4DB6AC',
		[PredefinedIconColors.green]: '#2ECC71',
		[PredefinedIconColors.gray]: '#90A4AE',
	};

	form = this.fb.group({
		icon: this.fb.control<MaterialIcon | null>(null, [Validators.required]),
		color: this.fb.control<PredefinedIconColors | 'custom' | null>(null, [Validators.required]),
	});
	formValue = toRawValueSignal(this.form);
	customColor = signal<string>(this.DEFAULT_CUSTOM_BACKGROUND);

	selectedColor = computed<string | undefined>(() => {
		const formValue = this.formValue();
		const customColor = this.customColor();
		if (!formValue.color) return undefined;
		if (formValue.color === 'custom') {
			return customColor === this.DEFAULT_CUSTOM_BACKGROUND ? undefined : customColor;
		}
		return this.predefinedIconColorsData[formValue.color];
	});

	constructor() {
		super();
		this.addSubscription(
			this.form.valueChanges.pipe(pairwise()).subscribe(([prevValue, newValue]) => {
				if (prevValue.color === 'custom' && newValue.color !== prevValue.color)
					this.customColor.set(this.DEFAULT_CUSTOM_BACKGROUND);
				if (
					(this.form.valid && this.formValue().color !== 'custom') ||
					(this.form.valid &&
						this.formValue().color === 'custom' &&
						this.customColor() !== this.DEFAULT_CUSTOM_BACKGROUND)
				)
					this.menuTrigger().closeMenu();
			}),
		);
	}

	toggleColorPicker(picker: HTMLInputElement): void {
		picker.click();
		if (this.formValue().color !== 'custom') {
			this.form.controls.color.setValue('custom');
		}
	}

	closeMenuWithData(): void {
		if (this.form.invalid) {
			this.form.reset();
			return;
		}
		const formValue = this.form.getRawValue();
		this.closed.emit({
			icon: formValue.icon!,
			color: this.selectedColor()!,
		});
	}
}
