import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
	AchievementGet,
	AchievementTier,
	AchievementType,
	UserAchievementGet,
} from '../../../app/data-model/modules/achievement';
import { WorkspaceGet } from '../../../app/data-model/modules/workspaces/WorkspaceGet';
import { AchievementService } from '../../../app/private/profile-dialog/achievements/achievement.service';
import { AchievementStore } from '../../../app/private/profile-dialog/achievements/achievement.store';
import { WorkspaceService } from '../../../app/shared/workspace.service';

const mockAchievement: AchievementGet = {
	id: 'ach-1',
	name: 'First Transaction',
	description: 'Create your first transaction',
	tier: AchievementTier.BRONZE,
	type: AchievementType.TRANSACTION_COUNT,
	requirementValue: 1,
	currentProgress: 1,
	unlocked: true,
	unlockedAt: '2026-01-01',
};

const mockUserAchievement: UserAchievementGet = {
	id: 'ua-1',
	achievementId: 'ach-1',
	name: 'First Transaction',
	description: 'Create your first transaction',
	tier: AchievementTier.BRONZE,
	type: AchievementType.TRANSACTION_COUNT,
	requirementValue: 1,
	unlockedAt: '2026-01-01',
};

async function waitForResources(): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, 0));
	TestBed.flushEffects();
}

describe('AchievementStore', () => {
	let store: InstanceType<typeof AchievementStore>;
	let mockService: jasmine.SpyObj<AchievementService>;

	beforeEach(() => {
		mockService = jasmine.createSpyObj<AchievementService>('AchievementService', ['list', 'listUnlocked']);
		mockService.list.and.resolveTo([]);
		mockService.listUnlocked.and.resolveTo([]);

		const currentWorkspace = signal<WorkspaceGet | null>(null);

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				AchievementStore,
				{ provide: AchievementService, useValue: mockService },
				{ provide: WorkspaceService, useValue: { currentWorkspace: currentWorkspace.asReadonly() } },
			],
		});

		store = TestBed.inject(AchievementStore);
	});

	it('achievements is undefined before the resource resolves', () => {
		expect(store.achievements()).toBeUndefined();
	});

	it('unlockedAchievements defaults to empty array before the resource resolves', () => {
		expect(store.unlockedAchievements()).toEqual([]);
	});

	it('isLoading is true while both resources are pending', () => {
		expect(store.isLoading()).toBeTrue();
	});

	it('achievements reflects the list returned by the service', async () => {
		mockService.list.and.resolveTo([mockAchievement]);
		store.allResource.reload();
		await waitForResources();
		expect(store.achievements()).toEqual([mockAchievement]);
	});

	it('unlockedAchievements reflects the list returned by the service', async () => {
		mockService.listUnlocked.and.resolveTo([mockUserAchievement]);
		store.unlockedResource.reload();
		await waitForResources();
		expect(store.unlockedAchievements()).toEqual([mockUserAchievement]);
	});

	it('reload() calls allResource.reload and unlockedResource.reload', () => {
		spyOn(store.allResource, 'reload');
		spyOn(store.unlockedResource, 'reload');
		store.reload();
		expect(store.allResource.reload).toHaveBeenCalledTimes(1);
		expect(store.unlockedResource.reload).toHaveBeenCalledTimes(1);
	});
});
