import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutoTrimDirective } from '../../../app/shared/auto-trim.directive';

@Component({
	template: `<input [formControl]="ctrl" autoTrim />`,
	imports: [ReactiveFormsModule, AutoTrimDirective],
})
class HostComponent {
	ctrl = new FormControl('');
}

describe('AutoTrimDirective', () => {
	let fixture: ComponentFixture<HostComponent>;
	let input: HTMLInputElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
		input = fixture.nativeElement.querySelector('input');
	});

	function setInputValue(value: string): void {
		input.value = value;
		input.dispatchEvent(new Event('input'));
		fixture.detectChanges();
	}

	it('trims leading and trailing whitespace', () => {
		setInputValue('  hello  ');
		expect(fixture.componentInstance.ctrl.value).toBe('hello');
	});

	it('collapses multiple internal spaces into one', () => {
		setInputValue('hello   world');
		expect(fixture.componentInstance.ctrl.value).toBe('hello world');
	});

	it('trims and collapses combined whitespace', () => {
		setInputValue('  foo   bar  ');
		expect(fixture.componentInstance.ctrl.value).toBe('foo bar');
	});

	it('leaves a clean string unchanged', () => {
		setInputValue('clean value');
		expect(fixture.componentInstance.ctrl.value).toBe('clean value');
	});

	it('collapses a string of only spaces to empty string', () => {
		setInputValue('     ');
		expect(fixture.componentInstance.ctrl.value).toBe('');
	});

	it('passes non-string values through without modification', () => {
		// Simulate a value accessor that emits a non-string (e.g. null)
		fixture.componentInstance.ctrl.setValue(null);
		expect(fixture.componentInstance.ctrl.value).toBeNull();
	});
});
