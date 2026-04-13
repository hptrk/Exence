import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExCellDirective } from '../../../app/shared/data-table/ex-cell.directive';

@Component({
	template: `<ng-template exCell="name">content</ng-template>`,
	imports: [ExCellDirective],
})
class HostComponent {
	@ViewChild(ExCellDirective) directive!: ExCellDirective;
}

describe('ExCellDirective', () => {
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
	});

	it('reads the column name from the exCell alias input', () => {
		expect(fixture.componentInstance.directive.column()).toBe('name');
	});

	it('exposes the TemplateRef via the template property', () => {
		expect(fixture.componentInstance.directive.template).toBeInstanceOf(TemplateRef);
	});
});
