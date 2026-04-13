import { signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';
import { FilterMenuComponent } from '../../../app/shared/filter-menu/filter-menu.component';
import { DisplaySizeService } from '../../../app/shared/display-size.service';
import { getHiddenBadge } from '../locators/filter-menu.locators';

const mockTransloco = {
	translate: (key: string) => key,
	config: { reRenderOnLangChange: false },
	langChanges$: EMPTY,
	_loadDependencies: () => EMPTY,
};

describe('FilterMenuComponent', () => {
	let isMd: ReturnType<typeof signal<boolean>>;
	let form: FormGroup;

	beforeEach(async () => {
		isMd = signal(true);
		form = new FormGroup({
			keyword: new FormControl(''),
			amount: new FormControl(null),
		});

		await TestBed.configureTestingModule({
			imports: [FilterMenuComponent],
			providers: [
				provideNoopAnimations(),
				{
					provide: DisplaySizeService,
					useValue: {
						isSm: signal(true),
						isMd,
						getObserverByName: () => signal(true),
					},
				},
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(FilterMenuComponent);
		fixture.componentRef.setInput('form', form);
		fixture.componentRef.setInput('appliedFiltersCount', 0);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	describe('clearFilters', () => {
		it('should reset the form when clearFilters is called', () => {
			const fixture = TestBed.createComponent(FilterMenuComponent);
			fixture.componentRef.setInput('form', form);
			fixture.componentRef.setInput('appliedFiltersCount', 1);
			fixture.detectChanges();
			form.controls['keyword'].setValue('groceries');
			fixture.componentInstance.clearFilters();
			expect(form.controls['keyword'].value).toBeNull();
		});
	});

	describe('bottom sheet', () => {
		it('should open the bottom sheet when openBottomSheet is called', () => {
			const fixture = TestBed.createComponent(FilterMenuComponent);
			fixture.componentRef.setInput('form', form);
			fixture.componentRef.setInput('appliedFiltersCount', 0);
			fixture.detectChanges();
			// Use the component's own injector to get the same instance the component uses
			const bottomSheet = fixture.debugElement.injector.get(MatBottomSheet);
			spyOn(bottomSheet, 'open').and.callFake(() => jasmine.createSpyObj('ref', ['afterDismissed']));
			fixture.componentInstance.openBottomSheet();
			expect(bottomSheet.open).toHaveBeenCalled();
		});

		it('should dismiss the bottom sheet when closeSheet is called', () => {
			const fixture = TestBed.createComponent(FilterMenuComponent);
			fixture.componentRef.setInput('form', form);
			fixture.componentRef.setInput('appliedFiltersCount', 0);
			fixture.detectChanges();
			const bottomSheet = fixture.debugElement.injector.get(MatBottomSheet);
			spyOn(bottomSheet, 'dismiss');
			fixture.componentInstance.closeSheet();
			expect(bottomSheet.dismiss).toHaveBeenCalled();
		});
	});

	describe('template rendering', () => {
		it('should render the MatMenu trigger button when isMd is true', () => {
			isMd.set(true);
			const fixture = TestBed.createComponent(FilterMenuComponent);
			fixture.componentRef.setInput('form', form);
			fixture.componentRef.setInput('appliedFiltersCount', 0);
			fixture.detectChanges();
			const trigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
			expect(trigger).toBeTruthy();
		});

		it('should not render the MatMenu trigger button when isMd is false', () => {
			isMd.set(false);
			const fixture = TestBed.createComponent(FilterMenuComponent);
			fixture.componentRef.setInput('form', form);
			fixture.componentRef.setInput('appliedFiltersCount', 0);
			fixture.detectChanges();
			const trigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
			expect(trigger).toBeNull();
		});

		it('should show badge when appliedFiltersCount is greater than 0', () => {
			const fixture = TestBed.createComponent(FilterMenuComponent);
			fixture.componentRef.setInput('form', form);
			fixture.componentRef.setInput('appliedFiltersCount', 3);
			fixture.detectChanges();
			expect(getHiddenBadge(fixture.nativeElement)).toBeNull();
		});

		it('should hide badge when appliedFiltersCount is 0', () => {
			const fixture = TestBed.createComponent(FilterMenuComponent);
			fixture.componentRef.setInput('form', form);
			fixture.componentRef.setInput('appliedFiltersCount', 0);
			fixture.detectChanges();
			expect(getHiddenBadge(fixture.nativeElement)).toBeTruthy();
		});
	});
});
