import { CategoryType } from './CategoryType';
import { MaterialIcon } from './MaterialIcon';

export interface Category {
	id?: number;
	type: CategoryType;
	name: string;
	icon: MaterialIcon;
	color: string;
	note?: string;
}
