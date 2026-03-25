import { Component, model } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';

@Component({
	selector: 'ex-timeframe',
	templateUrl: './timeframe.component.html',
	styleUrl: './timeframe.component.scss',
	imports: [MatButtonToggleModule, EnumValuePipe],
})
export class TimeframeComponent {
	selectedTimeframe = model.required<Timeframe>();

	readonly Timeframe = Timeframe;
}
