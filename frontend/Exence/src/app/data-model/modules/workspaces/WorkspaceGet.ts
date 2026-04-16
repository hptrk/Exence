import { WorkspaceRole } from './WorkspaceRole';

export interface WorkspaceGet {
	id: number;
	name: string;
	role: WorkspaceRole;
}
