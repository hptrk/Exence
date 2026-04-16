import { WidgetDataPayload } from '../WidgetDataPayload';

export interface InvestmentWidgetDataResponse<T extends WidgetDataPayload = WidgetDataPayload> {
	payload: T;
}
