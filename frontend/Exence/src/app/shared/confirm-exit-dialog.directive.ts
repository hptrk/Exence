import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroupDirective } from "@angular/forms";
import { Subscription } from "rxjs";
import { DialogRef } from "./dialog/dialog.service";

@Directive({
	selector: '[confirmExitDialog][formGroup]',
})
export class ConfirmExitDialogDirective implements OnInit, OnDestroy {
	private subscription?: Subscription;

	@Input({ required: true })
	confirmExitDialog!: DialogRef<any, any>;

	constructor(private readonly formGroupDirective: FormGroupDirective) { }

	ngOnInit(): void {
		const form = this.formGroupDirective.form;

		this.subscription?.unsubscribe();
		
		this.subscription = form.valueChanges.subscribe(() => {
			this.confirmExitDialog.setLocked(form.dirty);
		});
		
		this.confirmExitDialog.setLocked(form.dirty);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}