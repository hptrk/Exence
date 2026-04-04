import { ChartWidget } from './ChartWidget';
import { StatCardWidget } from './StatCardWidget';

export interface WidgetLayoutResponse {
	statCards: StatCardWidget[];
	charts: ChartWidget[];
}
