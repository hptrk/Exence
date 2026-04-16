import { WidgetDataPayload } from '../WidgetDataPayload';

export interface DebtWidgetDataResponse<T extends WidgetDataPayload> {
	payload: T;
}
