import { inject } from "@angular/core";
import { CanDeactivateFn } from "@angular/router";
import { ConfirmExitService } from "../../confirm-exit.service";

export interface HasChangesComponent {
	hasChanges(): boolean;
}

export const hasChangesGuard: CanDeactivateFn<HasChangesComponent> = async (
	component: HasChangesComponent
) => {
	const confirmExitService = inject(ConfirmExitService);
	
	console.log(component.hasChanges ? component.hasChanges() : 'undefined')
	if (!component.hasChanges || !component.hasChanges()) return true;

	const result = await confirmExitService.showConfirmDialog();
	return result;
}