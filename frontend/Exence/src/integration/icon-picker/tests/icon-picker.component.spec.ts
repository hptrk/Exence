import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';
import { MaterialIcon } from '../../../app/data-model/modules/category/MaterialIcon';
import { IconPickerComponent } from '../../../app/shared/icon-picker/icon-picker.component';
import { DisplaySizeService } from '../../../app/shared/display-size.service';

const mockTransloco = {
	translate: (key: string) => key,
	config: { reRenderOnLangChange: false },
	langChanges$: EMPTY,
	_loadDependencies: () => EMPTY,
};

const mockDisplay = {
	isSm: signal(true),
	getObserverByName: () => signal(true),
};

describe('IconPickerComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IconPickerComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: DisplaySizeService, useValue: mockDisplay },
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(IconPickerComponent);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	describe('form state', () => {
		it('should initialize with an invalid form (icon and color are null)', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			expect(fixture.componentInstance.form.invalid).toBeTrue();
		});

		it('should become valid when both icon and color are set', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			const { form } = fixture.componentInstance;
			form.controls.icon.setValue('home' as MaterialIcon);
			form.controls.color.setValue('yellow' as never);
			expect(form.valid).toBeTrue();
		});

		it('should remain invalid when only icon is set', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			fixture.componentInstance.form.controls.icon.setValue('home' as MaterialIcon);
			expect(fixture.componentInstance.form.invalid).toBeTrue();
		});

		it('should remain invalid when only color is set', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			fixture.componentInstance.form.controls.color.setValue('blue' as never);
			expect(fixture.componentInstance.form.invalid).toBeTrue();
		});
	});

	describe('selectedColor', () => {
		it('should be undefined when no color is selected', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			expect(fixture.componentInstance.selectedColor()).toBeUndefined();
		});

		it('should return the predefined color hex when a predefined color is selected', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			fixture.componentInstance.form.controls.color.setValue('blue' as never);
			expect(fixture.componentInstance.selectedColor()).toBe('#4FC3F7');
		});

		it('should return the predefined hex for yellow', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			fixture.componentInstance.form.controls.color.setValue('yellow' as never);
			expect(fixture.componentInstance.selectedColor()).toBe('#FFB300');
		});

		it('should return undefined when custom color is selected but still at default gradient', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			fixture.componentInstance.form.controls.color.setValue('custom' as never);
			expect(fixture.componentInstance.selectedColor()).toBeUndefined();
		});

		it('should return the custom color when a specific custom color is set', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			fixture.componentInstance.form.controls.color.setValue('custom' as never);
			fixture.componentInstance.customColor.set('#123456');
			expect(fixture.componentInstance.selectedColor()).toBe('#123456');
		});
	});

	describe('closeMenuWithData', () => {
		it('should emit closed output with icon and color when form is valid', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			const { componentInstance } = fixture;
			componentInstance.form.controls.icon.setValue('home' as MaterialIcon);
			componentInstance.form.controls.color.setValue('blue' as never);
			const closedSpy = jasmine.createSpy('closed');
			componentInstance.closed.subscribe(closedSpy);
			componentInstance.closeMenuWithData();
			expect(closedSpy).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'home', color: '#4FC3F7' }));
		});

		it('should reset form and not emit when form is invalid', () => {
			const fixture = TestBed.createComponent(IconPickerComponent);
			fixture.detectChanges();
			const { componentInstance } = fixture;
			componentInstance.form.controls.icon.setValue('home' as MaterialIcon);
			// color is still null — form is invalid
			const closedSpy = jasmine.createSpy('closed');
			componentInstance.closed.subscribe(closedSpy);
			componentInstance.closeMenuWithData();
			expect(closedSpy).not.toHaveBeenCalled();
			expect(componentInstance.form.controls.icon.value).toBeNull();
		});
	});
});
