import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
	selector: 'ex-view-toggle',
	imports: [MatButtonToggleModule, CommonModule, FormsModule],
	templateUrl: './view-toggle.component.html',
	styleUrl: './view-toggle.component.scss',
})
export class ViewToggleComponent {
	public selectedView = 'year';

	onViewChange() {
		console.log('selected view:', this.selectedView);
	}
}
