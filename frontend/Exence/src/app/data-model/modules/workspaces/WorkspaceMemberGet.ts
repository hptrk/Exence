import { WorkspaceRole } from './WorkspaceRole';

export interface WorkspaceMemberGet {
	userId: number;
	username: string;
	email: string;
	role: WorkspaceRole;
	joinedAt: Date;
}
