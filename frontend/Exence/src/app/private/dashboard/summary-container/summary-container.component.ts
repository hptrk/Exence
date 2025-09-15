import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'ex-summary-container',
	imports: [MatCardModule, MatIconModule],
	templateUrl: './summary-container.component.html',
	styleUrl: './summary-container.component.scss',
})
export class SummaryContainerComponent {
	icon = input<string>();
	label = input<string>();
	value = input<number>();

	get displayValue(): string {
		return this.value()! > 0 ? `+${this.value()} Ft` : `${this.value()} Ft`;
	}
	get valueColor(): string {
		return this.value() == 0
			? 'var(--on-surface) '
			: this.value()! > 0
				? 'var(--mat-sys-secondary-fixed)'
				: 'var(--mat-sys-tertiary-fixed)';
	}
}
