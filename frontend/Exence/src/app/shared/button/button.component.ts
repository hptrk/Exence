import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, inject, input } from '@angular/core';
import { MatButtonAppearance, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisplaySizeBreakpoint, DisplaySizeService } from '../display-size.service';
import { SvgIcons } from '../svg-icons/svg-icons';

@Component({
	selector: 'ex-button',
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
	imports: [CommonModule, MatButtonModule, MatIconModule],
	host: {
		'[class.disabled]': 'disabled()',
	},
})
export class ButtonComponent {
	display = inject(DisplaySizeService);

	disabled = input<boolean>(false);
	type = input<'button' | 'submit' | 'reset'>('button');
	color = input<'primary' | 'accent' | 'success' | 'error' | 'warn'>('primary');

	collapsedStyle = input<'text' | 'outlined' | 'filled'>('filled');
	collapseUnder = input<DisplaySizeBreakpoint>('sm');

	shouldNotCollapse = this.display.getObserverByName(this.collapseUnder);

	iconButton = input(false, { transform: booleanAttribute });
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();

	iconPositionEnd = input(false, { transform: booleanAttribute });

	// appearance
	filled = input(false, { transform: booleanAttribute });
	outlined = input(false, { transform: booleanAttribute });
	text = input(false, { transform: booleanAttribute });
	get appearance(): MatButtonAppearance {
		if (!this.shouldNotCollapse()) {
			return this.collapsedStyle();
		} else {
			if (this.outlined()) return 'outlined';
			if (this.text()) return 'text';
			return 'filled';
		}
	}
}
