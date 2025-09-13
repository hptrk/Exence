import { booleanAttribute, Directive, ElementRef, inject, Input, input, OnInit, Renderer2 } from "@angular/core";
import { BaseComponent } from "./base-component/base.component";
import { DisplayThemeService } from "./display-theme.service";
import { Observable } from "rxjs";

const darkClass = 'theme-dark';

@Directive({
	selector: '[darkMode]',
})
export class DarkModeDirective extends BaseComponent implements OnInit {
	private readonly themeService = inject(DisplayThemeService);
	private readonly element = inject(ElementRef);
	private readonly renderer = inject(Renderer2);

	isDark$: Observable<boolean> = this.themeService.isDark$;

	readonly darkMode = input(false, {transform: booleanAttribute});

	constructor() { super(); }

	ngOnInit(): void {
		this.addSubscription(
			this.isDark$.subscribe(isDark => {
				if (this.darkMode()) {
					if (isDark)
						this.renderer.addClass(this.element.nativeElement, darkClass);
					else
						this.renderer.removeClass(this.element.nativeElement, darkClass);
				}
			})
		);
	}
}
