import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from '../button/button.component';
import { StopPropagationDirective } from '../stop-propagation.directive';

@Component({
	selector: 'ex-info-button',
	template: `
		<ex-button
			#tooltipButton="matTooltip"
			iconButton
			stopPropagation
			color="accent"
			[matTooltip]="tooltip()"
			(click)="$event.preventDefault(); tooltipButton.toggle()"
		/>
	`,
	styles: `
		:host {
			position: absolute;
			top: 1rem;
			right: 1rem;
		}
	`,
	imports: [ButtonComponent, MatTooltipModule, StopPropagationDirective],
})
export class InfoButtonComponent {
	tooltip = input.required<string>();
}
