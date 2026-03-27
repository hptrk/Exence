import { Component, model } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
	selector: 'ex-timeframe',
	templateUrl: './timeframe.component.html',
	styleUrl: './timeframe.component.scss',
	imports: [MatButtonToggleModule, EnumValuePipe, TranslocoPipe],
})
export class TimeframeComponent {
	selectedTimeframe = model.required<Timeframe>();

	readonly Timeframe = Timeframe;

	codeForTimeframe(timeframe: Timeframe): string {
		return `timeframe.${timeframe}`;
	}
}
