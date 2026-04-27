import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WorkspaceGet } from '../../../app/data-model/modules/workspaces/WorkspaceGet';
import { AchievementService } from '../../../app/private/profile-dialog/achievements/achievement.service';
import { AchievementStore } from '../../../app/private/profile-dialog/achievements/achievement.store';
import { WorkspaceService } from '../../../app/shared/workspace.service';

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

	it('reload() calls allResource.reload and unlockedResource.reload', () => {
		spyOn(store.allResource, 'reload');
		spyOn(store.unlockedResource, 'reload');
		store.reload();
		expect(store.allResource.reload).toHaveBeenCalledTimes(1);
		expect(store.unlockedResource.reload).toHaveBeenCalledTimes(1);
	});
});
