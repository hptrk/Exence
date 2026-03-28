import { Component, model } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationCode } from '../../../shared/i18n/translation-types';

@Component({
	selector: 'ex-timeframe',
	templateUrl: './timeframe.component.html',
	styleUrl: './timeframe.component.scss',
	imports: [MatButtonToggleModule, EnumValuePipe, TranslatePipe],
})
export class TimeframeComponent {
	selectedTimeframe = model.required<Timeframe>();

	readonly Timeframe = Timeframe;

	codeForTimeframe(timeframe: Timeframe): TranslationCode {
		return `timeframe.${timeframe}`;
	}
}
