import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroupDirective } from "@angular/forms";
import { Subscription } from "rxjs";
import { DialogRef } from "./dialog/dialog.service";
import { ConfirmExitService } from "./confirm-exit.service";

@Directive({
	selector: '[confirmExitDialog][formGroup]',
})
export class ConfirmExitDialogDirective implements OnInit, OnDestroy {
	private subscription?: Subscription;

	@Input({ required: true })
	confirmExitDialog!: DialogRef<any, any>;

	constructor(
		private readonly formGroupDirective: FormGroupDirective,
		private readonly confirmExitService: ConfirmExitService,	
	) { }

	ngOnInit(): void {
		const form = this.formGroupDirective.form;

		this.subscription?.unsubscribe();
		
		this.subscription = form.valueChanges.subscribe(() => {
			this.confirmExitDialog.setLocked(form.dirty);
		});
		
		this.confirmExitDialog.setLocked(form.dirty);
		this.confirmExitDialog.setOnCloseAttemptWhileLocked(async () => await this.confirmExitService.showConfirmDialog());
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}