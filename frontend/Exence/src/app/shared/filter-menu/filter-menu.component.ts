import { Component, inject, input, TemplateRef, viewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonComponent } from '../button/button.component';
import { DisplaySizeService } from '../display-size.service';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
	selector: 'ex-filter-menu',
	templateUrl: './filter-menu.component.html',
	styleUrl: './filter-menu.component.scss',
	imports: [CommonModule, MatMenuModule, MatBadgeModule, MatBottomSheetModule, ButtonComponent, TranslocoPipe],
})
export class FilterMenuComponent {
	private readonly bottomSheet = inject(MatBottomSheet);
	readonly display = inject(DisplaySizeService);

	form = input.required<FormGroup>();
	appliedFiltersCount = input.required<number>();

	filterSheet = viewChild<TemplateRef<unknown>>('filterSheet');

	openBottomSheet(): void {
		this.bottomSheet.open(this.filterSheet()!);
	}

	closeSheet(): void {
		this.bottomSheet.dismiss();
	}

	clearFilters(): void {
		this.form().reset();
	}
}
