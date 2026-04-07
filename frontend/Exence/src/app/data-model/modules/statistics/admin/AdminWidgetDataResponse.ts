import { AdminWidgetType } from '../widget-config.model';
import { WidgetDataPayload } from '../WidgetDataPayload';

export interface AdminWidgetDataResponse<T extends WidgetDataPayload> {
	type: AdminWidgetType;
	payload: T;
}
