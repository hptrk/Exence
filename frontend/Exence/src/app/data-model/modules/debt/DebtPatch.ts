import { DebtStatus } from './DebtStatus';
import { DebtType } from './DebtType';

export interface DebtPatch {
	title?: string;
	counterpartyName?: string;
	deadline?: string;
	type?: DebtType;
	status?: DebtStatus;
	categoryId?: number;
}
