import { CategoryType } from './CategoryType';
import { MaterialIcon } from './MaterialIcon';

export interface CategoryGet {
	id: number;
	name: string;
	icon: MaterialIcon;
	color: string;
	type: CategoryType;
	note?: string;
	balance: number;
}
