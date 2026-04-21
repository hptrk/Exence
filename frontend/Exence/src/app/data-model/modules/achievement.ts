export enum AchievementTier {
	BRONZE = 'BRONZE',
	SILVER = 'SILVER',
	GOLD = 'GOLD',
}

export enum AchievementType {
	TRANSACTION_COUNT = 'TRANSACTION_COUNT',
	GOAL_COUNT = 'GOAL_COUNT',
	GOAL_COMPLETED = 'GOAL_COMPLETED',
	DEBT_COUNT = 'DEBT_COUNT',
	DEBT_SETTLED = 'DEBT_SETTLED',
	APP_STREAK = 'APP_STREAK',
}

export interface AchievementGet {
	id: string;
	name: string;
	description: string;
	tier: AchievementTier;
	type: AchievementType;
	requirementValue: number;
	currentProgress: number;
	unlocked: boolean;
	unlockedAt?: string;
}

export interface UserAchievementGet {
	id: string;
	achievementId: string;
	name: string;
	description: string;
	tier: AchievementTier;
	type: AchievementType;
	requirementValue: number;
	unlockedAt: string;
}
