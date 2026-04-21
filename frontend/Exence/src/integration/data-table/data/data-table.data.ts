import { ColumnDef, TableAction } from '../../../app/shared/data-table/data-table.component';

export interface TestRow {
	id: number;
	name: string;
}

export const COLUMNS: ColumnDef[] = [
	{ key: 'name', header: 'dataTable.name' },
	{ key: 'actions', header: '' },
];

export const ROWS: TestRow[] = [
	{ id: 1, name: 'Alpha' },
	{ id: 2, name: 'Beta' },
	{ id: 3, name: 'Gamma' },
];

export const ACTIONS: TableAction<TestRow>[] = [
	{ label: 'literals.edit', icon: 'edit', handler: () => {} },
	{ label: 'literals.delete', icon: 'delete', handler: () => {} },
];

export const ACTIONS_WITH_DISABLED: TableAction<TestRow>[] = [
	{
		label: 'literals.edit',
		icon: 'edit',
		handler: () => {},
		disabled: (row: TestRow) => row.id === 1,
	},
];
