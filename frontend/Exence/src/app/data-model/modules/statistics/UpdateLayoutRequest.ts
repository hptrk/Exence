import { ChartLayoutItemRequest } from './ChartLayoutItemRequest';
import { StatCardLayoutItemRequest } from './StatCardLayoutItemRequest';

export interface UpdateLayoutRequest {
	statCards: StatCardLayoutItemRequest[];
	charts: ChartLayoutItemRequest[];
}
