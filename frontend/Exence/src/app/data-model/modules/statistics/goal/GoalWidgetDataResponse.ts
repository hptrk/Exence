import { WidgetDataPayload } from '../WidgetDataPayload';

export interface GoalWidgetDataResponse<T extends WidgetDataPayload> {
	payload: T;
}
