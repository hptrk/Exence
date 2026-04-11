import { booleanAttribute, Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from '../button/button.component';
import { StopPropagationDirective } from '../stop-propagation.directive';

@Component({
	selector: 'ex-info-button',
	template: `
		<ex-button
			data-testid="info-btn"
			#tooltipButton="matTooltip"
			iconButton
			stopPropagation
			color="accent"
			matIcon="info"
			[matTooltip]="tooltip()"
			(click)="$event.preventDefault(); tooltipButton.toggle()"
		/>
	`,
	styles: `
		:host.corner {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
		}
	`,
	imports: [ButtonComponent, MatTooltipModule, StopPropagationDirective],
	host: {
		'[class.corner]': '!block()',
	},
})
export class InfoButtonComponent {
	tooltip = input.required<string>();
	block = input(false, { transform: booleanAttribute });
}
