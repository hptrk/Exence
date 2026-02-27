import { Component, input } from '@angular/core';
import { ChartWidget } from '../Widget';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';

@Component({
	selector: 'ex-chart-widget-list',
	templateUrl: './chart-widget-list.component.html',
	styleUrl: './chart-widget-list.component.scss',
	imports: [ChartWidgetComponent],
})
export class ChartWidgetListComponent {
	data = input.required<ChartWidget[]>();

	// TODO position values are currently ignored, will be implemented in this ticket: https://horanszkipatrik.atlassian.net/browse/EX-151?atlOrigin=eyJpIjoiZjJkZTQ0ZWE1ZmE0NGYzYjg2YTc2OGU1YzhmYjg2NjIiLCJwIjoiaiJ9
}
