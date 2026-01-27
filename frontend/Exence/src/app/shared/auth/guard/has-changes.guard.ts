import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmExitService } from '../../confirm-exit.service';

export interface HasChangesComponent {
	hasChanges: () => boolean;
}

export const hasChangesGuard: CanDeactivateFn<HasChangesComponent> = async (
	component: HasChangesComponent
) => {
	const confirmExitService = inject(ConfirmExitService);
	
	const componentHasChanges = component.hasChanges();	
	const serviceHasChanges = confirmExitService.hasChanges();
	
	if (componentHasChanges || serviceHasChanges) {
		return await confirmExitService.showConfirmDialog();
	}

	return true;
};