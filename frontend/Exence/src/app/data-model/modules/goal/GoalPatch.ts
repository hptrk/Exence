import { GoalStatus } from './GoalStatus';

export interface GoalPatch {
	title?: string;
	description?: string;
	targetAmount?: number;
	currentAmount?: number;
	deadline?: string; // yyyy-MM-dd
	status?: GoalStatus;
	categoryId?: number;
}
