import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ButtonComponent } from '../button/button.component';

@Component({
	selector: 'ex-filter-menu',
	templateUrl: './filter-menu.component.html',
	styleUrl: './filter-menu.component.scss',
	imports: [
		MatMenuModule,
		MatBadgeModule,
		ButtonComponent,
	],
})
export class FilterMenuComponent {
	form = input.required<FormGroup>();
	appliedFiltersCount = input.required<number>();
	
	clearFilters(): void {
		this.form().reset();
	}
}