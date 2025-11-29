import { Directive, effect, ElementRef, inject, Renderer2 } from '@angular/core';
import { BaseComponent } from './base-component/base.component';
import { DisplayTheme, DisplayThemeService } from './display-theme.service';
import { themes } from './display-theme.service';

@Directive({
	selector: '[themeApplier]',
})
export class ThemeApplierDirective extends BaseComponent {
	private readonly themeService = inject(DisplayThemeService);
	private readonly element = inject(ElementRef);
	private readonly renderer = inject(Renderer2);

	previousTheme?: DisplayTheme;

	constructor() {
		super();

		effect(() => {
			const currentTheme = this.themeService.currentTheme;
			const preferredThemes = this.themeService.preferredThemes;
			const currentIsPreferred = !!Object.values(preferredThemes).find(
				themeData => themeData.name === currentTheme,
			);

			if (!currentIsPreferred || currentTheme === preferredThemes.secondary.name) {
				// removes the theme wheater it is the currently preferred or not
				if (this.previousTheme) {
					this.renderer.removeClass(
						this.element.nativeElement,
						themes.find(t => t.name === this.previousTheme)!.cssClass,
					);
				}
				this.renderer.addClass(this.element.nativeElement, preferredThemes.secondary.cssClass);
			} else {
				this.renderer.removeClass(this.element.nativeElement, preferredThemes.secondary.cssClass);
				this.renderer.addClass(this.element.nativeElement, preferredThemes.primary.cssClass);
			}

			this.previousTheme = currentTheme;
		});
	}
}
