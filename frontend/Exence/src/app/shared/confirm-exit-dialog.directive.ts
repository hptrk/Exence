import { Directive, inject, input, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { BaseComponent } from './base-component/base.component';
import { ConfirmExitService } from './confirm-exit.service';
import { DialogRef } from './dialog/dialog.service';

@Directive({
	selector: '[confirmExitDialog][formGroup]',
})
export class ConfirmExitDialogDirective extends BaseComponent implements OnInit {
	private readonly formGroupDirective = inject(FormGroupDirective);
	private readonly confirmExitService = inject(ConfirmExitService);	

	// eslint-disable-next-line
	confirmExitDialog = input.required<DialogRef<any, any>>();

	ngOnInit(): void {
		const form = this.formGroupDirective.form;

		this.addSubscription(form.valueChanges.subscribe(() => {
			this.confirmExitDialog().setLocked(form.dirty);
		}));
		
		this.confirmExitDialog().setLocked(form.dirty);
		this.confirmExitDialog().setOnCloseAttemptWhileLocked(async () => await this.confirmExitService.showConfirmDialog());
	}
}