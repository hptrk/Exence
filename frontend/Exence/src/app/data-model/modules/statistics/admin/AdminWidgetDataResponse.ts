import { WidgetDataPayload } from '../WidgetDataPayload';

export interface AdminWidgetDataResponse<T extends WidgetDataPayload> {
	payload: T;
}
