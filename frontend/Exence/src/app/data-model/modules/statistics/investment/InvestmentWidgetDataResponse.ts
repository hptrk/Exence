import { InvestmentWidgetType } from '../widget-config.model';
import { WidgetDataPayload } from '../WidgetDataPayload';

export interface InvestmentWidgetDataResponse<T extends WidgetDataPayload = WidgetDataPayload> {
	type: InvestmentWidgetType;
	payload: T;
}
