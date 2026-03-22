import { ChartLayoutItemRequest } from './ChartLayoutItemRequest';
import { StatCardLayoutItemRequest } from './StatCardLayoutItemRequest';
import { WidgetSetting } from './WidgetSetting';

export interface UpdateLayoutRequest {
	statCards: StatCardLayoutItemRequest[];
	charts: ChartLayoutItemRequest[];
	updateSettings?: Record<WidgetSetting, unknown>;
	title?: string;
}
