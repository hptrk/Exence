import { WidgetType } from './widget-config.model';
import { WidgetDataPayload } from './WidgetDataPayload';

export interface WidgetDataResponse<T extends WidgetDataPayload = WidgetDataPayload> {
	widgetId: number;
	type: WidgetType;
	payload: T;
}
