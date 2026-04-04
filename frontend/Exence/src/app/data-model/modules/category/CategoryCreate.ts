import { CategoryType } from './CategoryType';
import { MaterialIcon } from './MaterialIcon';

export interface CategoryCreate {
	name: string;
	icon: MaterialIcon;
	color: string;
	type: CategoryType;
	note?: string;
}
