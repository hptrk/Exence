import { Timeframe } from '../Timeframe';

export interface AdminWidgetRequest {
	startDate: Date;
	endDate: Date;
	timeframe: Timeframe;
}
