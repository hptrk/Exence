import { WidgetDataPayload } from './WidgetDataPayload';
import { WidgetSetting } from './WidgetSetting';

export interface WidgetDataResponse<T extends WidgetDataPayload = WidgetDataPayload> {
	widgetId: number;
	payload: T;
	settings?: Record<WidgetSetting, unknown>;
}
