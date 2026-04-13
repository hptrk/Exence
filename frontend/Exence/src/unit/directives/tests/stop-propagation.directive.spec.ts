import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StopPropagationDirective } from '../../../app/shared/stop-propagation.directive';

@Component({
	template: `
		<div (click)="parentClicked()">
			<button stopPropagation>target</button>
		</div>
	`,
	imports: [StopPropagationDirective],
})
class DefaultEventsHostComponent {
	parentClicked = jasmine.createSpy('parentClicked');
}

@Component({
	template: `
		<div (click)="parentClicked()" (mousedown)="parentMousedown()">
			<button stopPropagation [events]="events">target</button>
		</div>
	`,
	imports: [StopPropagationDirective],
})
class ArrayEventsHostComponent {
	events: string[] = ['mousedown'];
	parentClicked = jasmine.createSpy('parentClicked');
	parentMousedown = jasmine.createSpy('parentMousedown');
}

@Component({
	template: `
		<div (mousedown)="parentMousedown()">
			<button stopPropagation [events]="'mousedown'">target</button>
		</div>
	`,
	imports: [StopPropagationDirective],
})
class StringEventHostComponent {
	parentMousedown = jasmine.createSpy('parentMousedown');
}

describe('StopPropagationDirective', () => {
	describe('default (click) event', () => {
		let fixture: ComponentFixture<DefaultEventsHostComponent>;
		let button: HTMLButtonElement;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [DefaultEventsHostComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(DefaultEventsHostComponent);
			fixture.detectChanges();
			button = fixture.nativeElement.querySelector('button');
		});

		it('prevents click from bubbling to the parent', () => {
			button.click();
			expect(fixture.componentInstance.parentClicked).not.toHaveBeenCalled();
		});
	});

	describe('custom events array input', () => {
		let fixture: ComponentFixture<ArrayEventsHostComponent>;
		let button: HTMLButtonElement;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ArrayEventsHostComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(ArrayEventsHostComponent);
			fixture.detectChanges();
			button = fixture.nativeElement.querySelector('button');
		});

		it('stops propagation for the configured event', () => {
			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			expect(fixture.componentInstance.parentMousedown).not.toHaveBeenCalled();
		});

		it('does not block events that are not configured', () => {
			button.click();
			expect(fixture.componentInstance.parentClicked).toHaveBeenCalled();
		});
	});

	describe('custom events string input', () => {
		let fixture: ComponentFixture<StringEventHostComponent>;
		let button: HTMLButtonElement;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [StringEventHostComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(StringEventHostComponent);
			fixture.detectChanges();
			button = fixture.nativeElement.querySelector('button');
		});

		it('stops propagation when events is a single string', () => {
			button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			expect(fixture.componentInstance.parentMousedown).not.toHaveBeenCalled();
		});
	});
});
