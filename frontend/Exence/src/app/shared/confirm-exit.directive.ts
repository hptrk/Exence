import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ConfirmExitService } from './confirm-exit.service';

@Directive({
	selector: '[confirmExit][formGroup]',
	standalone: true,
})
export class ConfirmExitDirective implements OnInit, OnDestroy {
	private readonly formGroupDirective = inject(FormGroupDirective);
	private readonly confirmExitService = inject(ConfirmExitService);

	ngOnInit(): void {
		const form = this.formGroupDirective.form;
		this.confirmExitService.registerForm(form);
	}

	ngOnDestroy(): void {
		const form = this.formGroupDirective.form;
		this.confirmExitService.unregisterForm(form);
	}
}