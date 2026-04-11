import { CategoryGet } from '../../../app/data-model/modules/category/CategoryGet';
import { MaterialIcon } from '../../../app/data-model/modules/category/MaterialIcon';
import { CategoryType } from '../../../app/data-model/modules/category/CategoryType';

export const MOCK_CATEGORIES: CategoryGet[] = [
	{ id: 1, name: 'Groceries', type: CategoryType.EXPENSE, icon: MaterialIcon.LOCAL_GROCERY_STORE, color: '#ff0000' },
	{ id: 2, name: 'Salary', type: CategoryType.INCOME, icon: MaterialIcon.WORK, color: '#00ff00' },
	{ id: 3, name: 'Shared', type: CategoryType.MIXED, icon: MaterialIcon.ACCOUNT_BALANCE, color: '#0000ff' },
];
