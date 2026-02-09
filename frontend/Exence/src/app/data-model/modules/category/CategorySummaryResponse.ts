import { MaterialIcon } from './MaterialIcon';

export interface CategorySummaryResponse {
	id?: number;
	name: string;
	icon: MaterialIcon;
	totalAmount: number;
}