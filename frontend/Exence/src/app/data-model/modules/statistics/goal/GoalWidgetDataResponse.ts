import { GoalWidgetType } from '../widget-config.model';
import { WidgetDataPayload } from '../WidgetDataPayload';

export interface GoalWidgetDataResponse<T extends WidgetDataPayload> {
	type: GoalWidgetType;
	payload: T;
}
