import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmExitDirective } from '../../../app/shared/confirm-exit.directive';
import { ConfirmExitService } from '../../../app/shared/confirm-exit.service';

@Component({
	template: `<form [formGroup]="form" confirmExit></form>`,
	imports: [ReactiveFormsModule, ConfirmExitDirective],
})
class HostComponent {
	form = new FormGroup({});
}

describe('ConfirmExitDirective', () => {
	let fixture: ComponentFixture<HostComponent>;
	let confirmExitSpy: jasmine.SpyObj<ConfirmExitService>;

	beforeEach(async () => {
		confirmExitSpy = jasmine.createSpyObj('ConfirmExitService', ['registerForm', 'unregisterForm']);

		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [{ provide: ConfirmExitService, useValue: confirmExitSpy }],
		}).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
	});

	it('registers the form with ConfirmExitService on init', () => {
		expect(confirmExitSpy.registerForm).toHaveBeenCalledOnceWith(fixture.componentInstance.form);
	});

	it('unregisters the form with ConfirmExitService on destroy', () => {
		fixture.destroy();
		expect(confirmExitSpy.unregisterForm).toHaveBeenCalledOnceWith(fixture.componentInstance.form);
	});
});
