import { ChartLayoutItem } from './ChartLayoutItem';
import { StatCardLayoutItem } from './StatCardLayoutItem';

export interface UpdateLayoutRequest {
	statCards: StatCardLayoutItem[];
	widgets: ChartLayoutItem[];
}
