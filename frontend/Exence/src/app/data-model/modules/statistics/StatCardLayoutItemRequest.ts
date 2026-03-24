import { WidgetSetting } from './WidgetSetting';

export interface StatCardLayoutItemRequest {
	id: number;
	displayOrder: number;
	settings?: Record<WidgetSetting, unknown>;
	title?: string;
}
