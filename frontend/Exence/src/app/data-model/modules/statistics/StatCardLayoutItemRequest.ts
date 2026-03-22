import { WidgetSetting } from './WidgetSetting';

export interface StatCardLayoutItemRequest {
	id: number;
	displayOrder: number;
	updateSettings?: Record<WidgetSetting, unknown>;
	title?: string;
}
