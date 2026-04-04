import { CategoryType } from './CategoryType';
import { MaterialIcon } from './MaterialIcon';

export interface CategoryPatch {
	name?: string;
	icon?: MaterialIcon;
	color?: string;
	type?: CategoryType;
	note?: string;
}
