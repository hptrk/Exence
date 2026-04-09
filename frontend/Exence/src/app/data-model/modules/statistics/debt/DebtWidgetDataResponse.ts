import { DebtWidgetType } from '../widget-config.model';
import { WidgetDataPayload } from '../WidgetDataPayload';

export interface DebtWidgetDataResponse<T extends WidgetDataPayload> {
	type: DebtWidgetType;
	payload: T;
}
