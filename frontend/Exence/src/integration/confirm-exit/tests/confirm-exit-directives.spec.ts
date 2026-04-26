import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmExitDirective } from '../../../app/shared/confirm-exit.directive';
import { ConfirmExitDialogDirective } from '../../../app/shared/confirm-exit-dialog.directive';
import { ConfirmExitService } from '../../../app/shared/confirm-exit.service';
import { DialogRef } from '../../../app/shared/dialog/dialog.service';

@Component({
	template: `<div [formGroup]="form" confirmExit></div>`,
	standalone: true,
	imports: [ConfirmExitDirective, ReactiveFormsModule],
})
class ConfirmExitHostComponent {
	form = new FormGroup({ name: new FormControl('') });
}

@Component({
	template: `<div [formGroup]="form" [confirmExitDialog]="dialogRef"></div>`,
	standalone: true,
	imports: [ConfirmExitDialogDirective, ReactiveFormsModule],
})
class ConfirmExitDialogHostComponent {
	form = new FormGroup({ name: new FormControl('') });
	dialogRef = new DialogRef<null, boolean>(() => {}, null);
}

describe('ConfirmExitDirective', () => {
	let mockConfirmExitService: jasmine.SpyObj<ConfirmExitService>;

	beforeEach(async () => {
		mockConfirmExitService = jasmine.createSpyObj('ConfirmExitService', [
			'registerForm',
			'unregisterForm',
			'hasChanges',
			'showConfirmDialog',
		]);
		await TestBed.configureTestingModule({
			imports: [ConfirmExitHostComponent],
			providers: [{ provide: ConfirmExitService, useValue: mockConfirmExitService }],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(ConfirmExitHostComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should register form on init', () => {
		const fixture = TestBed.createComponent(ConfirmExitHostComponent);
		fixture.detectChanges();
		expect(mockConfirmExitService.registerForm).toHaveBeenCalledOnceWith(fixture.componentInstance.form);
	});

	it('should unregister form on destroy', () => {
		const fixture = TestBed.createComponent(ConfirmExitHostComponent);
		fixture.detectChanges();
		fixture.destroy();
		expect(mockConfirmExitService.unregisterForm).toHaveBeenCalledOnceWith(fixture.componentInstance.form);
	});
});

describe('ConfirmExitDialogDirective', () => {
	let mockConfirmExitService: jasmine.SpyObj<ConfirmExitService>;
	let fixture: ComponentFixture<ConfirmExitDialogHostComponent>;

	beforeEach(async () => {
		mockConfirmExitService = jasmine.createSpyObj('ConfirmExitService', [
			'registerForm',
			'unregisterForm',
			'hasChanges',
			'showConfirmDialog',
		]);
		mockConfirmExitService.showConfirmDialog.and.returnValue(Promise.resolve(true));

		await TestBed.configureTestingModule({
			imports: [ConfirmExitDialogHostComponent],
			providers: [{ provide: ConfirmExitService, useValue: mockConfirmExitService }],
		}).compileComponents();
		fixture = TestBed.createComponent(ConfirmExitDialogHostComponent);
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	it('should not lock dialog on init when form is pristine', () => {
		fixture.detectChanges();
		expect(fixture.componentInstance.dialogRef.isLocked).toBeFalse();
	});

	it('should lock dialog when form becomes dirty', () => {
		fixture.detectChanges();
		fixture.componentInstance.form.controls.name.markAsDirty();
		fixture.componentInstance.form.controls.name.setValue('changed');
		expect(fixture.componentInstance.dialogRef.isLocked).toBeTrue();
	});

	it('should set the onCloseAttemptWhileLocked callback on dialogRef', () => {
		const spy = spyOn(fixture.componentInstance.dialogRef, 'setOnCloseAttemptWhileLocked').and.callThrough();
		fixture.detectChanges();
		expect(spy).toHaveBeenCalledOnceWith(jasmine.any(Function));
	});

	it('should call showConfirmDialog when close is attempted while locked', async () => {
		fixture.detectChanges();
		fixture.componentInstance.form.controls.name.markAsDirty();
		fixture.componentInstance.form.controls.name.setValue('changed');
		await fixture.componentInstance.dialogRef.close(false);
		expect(mockConfirmExitService.showConfirmDialog).toHaveBeenCalled();
	});
});
