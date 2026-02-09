import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, viewChild } from '@angular/core';
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

const DEFAULT_CUSTOM_BACKGROUND = 'linear-gradient(to RIGHT bottom, #FF0000 5%, #F9D300 30%, #00FF00 45%, #003CFF 65%, #791EFF 70%, #F200FF 100%)';

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
		StopPropagationDirective,
	],
})
export class IconPickerComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly menuTrigger = viewChild.required<MatMenuTrigger>('menuTrigger');
	
	icon = input<MaterialIcon>();
	color = input<PredefinedIconColors | string>();

	closed = output<CategoryIconInfo>();

	private isColorPickerOpen = false;

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
	customColor = signal<string>(DEFAULT_CUSTOM_BACKGROUND);

	constructor() {
		super();
		this.addSubscription(
			this.form.valueChanges
				.pipe(pairwise())
				.subscribe(([prevValue, _]) => {
					if (prevValue.color === 'custom')
						this.customColor.set(DEFAULT_CUSTOM_BACKGROUND);
					if (this.form.valid)
						this.closeMenuWithData();
				})
		);
	}

	toggleColorPicker(picker: HTMLInputElement): void {
		if (this.isColorPickerOpen) {
			picker.blur();
			this.isColorPickerOpen = false;
		} else {
			picker.click();
			this.initializeForm(this.icon(), this.color());
			this.isColorPickerOpen = true;
		}
	}

	private initializeForm(icon?: MaterialIcon, color?: PredefinedIconColors | string): void {
		this.form.patchValue({
			icon: icon ?? null,
			color: color
				? (typeof color === 'string' ? 'custom' : this.predefinedIconColorsData[color])
				: null,
		});
		this.customColor.set(typeof color === 'string'
			? color
			: DEFAULT_CUSTOM_BACKGROUND
		);
	}

	private closeMenuWithData(): void {
		const formValue = this.form.getRawValue();
		this.closed.emit({
			icon: formValue.icon!,
			color: formValue.color === 'custom' ? this.customColor() : this.predefinedIconColorsData[formValue.color!],
		});
		this.menuTrigger().closeMenu();
	}
}