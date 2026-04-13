import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { SelectAutoFocusDirective } from '../../../app/shared/select-auto-focus.directive';

@Component({
	template: `<div selectAutoFocus [focusedInput]="input"></div>`,
	imports: [SelectAutoFocusDirective],
})
class WithInputHostComponent {
	// Create the element eagerly so the binding is stable on first render
	input = document.createElement('input');
}

@Component({
	template: `<div selectAutoFocus></div>`,
	imports: [SelectAutoFocusDirective],
})
class NoInputHostComponent {}

describe('SelectAutoFocusDirective', () => {
	let mockOpenedStream: Subject<void>;

	beforeEach(() => {
		mockOpenedStream = new Subject<void>();
		jasmine.clock().install();
	});

	afterEach(() => {
		jasmine.clock().uninstall();
	});

	describe('with focusedInput provided', () => {
		let fixture: ComponentFixture<WithInputHostComponent>;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [WithInputHostComponent],
				providers: [{ provide: MatSelect, useValue: { _openedStream: mockOpenedStream.asObservable() } }],
			}).compileComponents();

			fixture = TestBed.createComponent(WithInputHostComponent);
			fixture.detectChanges();
		});

		it('focuses the provided input after the select opens', () => {
			spyOn(fixture.componentInstance.input, 'focus');

			mockOpenedStream.next();
			jasmine.clock().tick(0);

			expect(fixture.componentInstance.input.focus).toHaveBeenCalled();
		});
	});

	describe('without focusedInput provided', () => {
		let fixture: ComponentFixture<NoInputHostComponent>;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [NoInputHostComponent],
				providers: [{ provide: MatSelect, useValue: { _openedStream: mockOpenedStream.asObservable() } }],
			}).compileComponents();

			fixture = TestBed.createComponent(NoInputHostComponent);
			fixture.detectChanges();
		});

		it('does not throw when no focusedInput is provided', () => {
			expect(() => {
				mockOpenedStream.next();
				jasmine.clock().tick(0);
			}).not.toThrow();
		});
	});
});
