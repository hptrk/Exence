import { WidgetType } from './widget-config.model';
import { WidgetDataPayload } from './WidgetDataPayload';
import { WidgetSetting } from './WidgetSetting';

export interface WidgetDataResponse<T extends WidgetDataPayload = WidgetDataPayload> {
	widgetId: number;
	type: WidgetType;
	payload: T;
	settings?: Record<WidgetSetting, unknown>;
}
