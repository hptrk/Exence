import { ColumnDef, TableAction } from '../../../app/shared/data-table/data-table.component';
import { TranslationCode } from '../../../app/shared/i18n/translation-types';

export interface TestRow {
	id: number;
	name: string;
}

export const COLUMNS: ColumnDef[] = [
	{ key: 'name', header: 'literals.name' as TranslationCode },
	{ key: 'actions', header: '' },
];

export const ROWS: TestRow[] = [
	{ id: 1, name: 'Alpha' },
	{ id: 2, name: 'Beta' },
	{ id: 3, name: 'Gamma' },
];

export const ACTIONS: TableAction<TestRow>[] = [
	{ label: 'literals.edit' as TranslationCode, icon: 'edit', handler: () => {} },
	{ label: 'literals.delete' as TranslationCode, icon: 'delete', handler: () => {} },
];

export const ACTIONS_WITH_DISABLED: TableAction<TestRow>[] = [
	{
		label: 'literals.edit' as TranslationCode,
		icon: 'edit',
		handler: () => {},
		disabled: (row: TestRow) => row.id === 1,
	},
];
