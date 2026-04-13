import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmExitDialogDirective } from '../../../app/shared/confirm-exit-dialog.directive';
import { ConfirmExitService } from '../../../app/shared/confirm-exit.service';
import { DialogRef } from '../../../app/shared/dialog/dialog.service';

@Component({
	template: `<form [formGroup]="form" [confirmExitDialog]="dialogRef"></form>`,
	imports: [ReactiveFormsModule, ConfirmExitDialogDirective],
})
class HostComponent {
	form = new FormGroup({ name: new FormControl('') });
	dialogRef = new DialogRef<unknown, void>(() => {}, undefined);
}

describe('ConfirmExitDialogDirective', () => {
	let fixture: ComponentFixture<HostComponent>;
	let confirmExitSpy: jasmine.SpyObj<ConfirmExitService>;

	beforeEach(async () => {
		confirmExitSpy = jasmine.createSpyObj('ConfirmExitService', ['showConfirmDialog']);

		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [{ provide: ConfirmExitService, useValue: confirmExitSpy }],
		}).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
	});

	it('calls setLocked(false) on init when the form is pristine', () => {
		spyOn(fixture.componentInstance.dialogRef, 'setLocked');
		fixture.detectChanges();
		expect(fixture.componentInstance.dialogRef.setLocked).toHaveBeenCalledWith(false);
	});

	it('sets up a close-attempt handler on the DialogRef', () => {
		spyOn(fixture.componentInstance.dialogRef, 'setOnCloseAttemptWhileLocked');
		fixture.detectChanges();
		expect(fixture.componentInstance.dialogRef.setOnCloseAttemptWhileLocked).toHaveBeenCalled();
	});

	it('calls setLocked(true) when the form becomes dirty', () => {
		fixture.detectChanges();
		spyOn(fixture.componentInstance.dialogRef, 'setLocked');
		fixture.componentInstance.form.markAsDirty();
		fixture.componentInstance.form.patchValue({ name: 'changed' });
		expect(fixture.componentInstance.dialogRef.setLocked).toHaveBeenCalledWith(true);
	});

	it('calls setLocked(false) when the form is marked pristine again', () => {
		fixture.detectChanges();
		fixture.componentInstance.form.markAsDirty();
		fixture.componentInstance.form.patchValue({ name: 'changed' });

		spyOn(fixture.componentInstance.dialogRef, 'setLocked');
		fixture.componentInstance.form.markAsPristine();
		fixture.componentInstance.form.patchValue({ name: 'reset' });
		expect(fixture.componentInstance.dialogRef.setLocked).toHaveBeenCalledWith(false);
	});

	it('calls showConfirmDialog when close is attempted while locked', async () => {
		confirmExitSpy.showConfirmDialog.and.returnValue(Promise.resolve(false));
		fixture.detectChanges();

		fixture.componentInstance.form.markAsDirty();
		fixture.componentInstance.form.patchValue({ name: 'changed' });
		fixture.detectChanges();

		await fixture.componentInstance.dialogRef.close(undefined as void);
		expect(confirmExitSpy.showConfirmDialog).toHaveBeenCalled();
	});
});
