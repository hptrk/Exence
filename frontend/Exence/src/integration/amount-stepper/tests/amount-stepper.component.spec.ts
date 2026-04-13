import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';
import { AmountStepperComponent } from '../../../app/shared/amount-stepper/amount-stepper.component';
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

describe('AmountStepperComponent', () => {
	let control: FormControl<number | null>;

	beforeEach(async () => {
		control = new FormControl<number | null>(0);

		await TestBed.configureTestingModule({
			imports: [AmountStepperComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: DisplaySizeService, useValue: mockDisplay },
				{ provide: TranslocoService, useValue: mockTransloco },
			],
		}).compileComponents();
	});

	function createFixture(
		options: {
			value?: number | null;
			min?: number;
			max?: number;
			step?: number;
			disabled?: boolean;
		} = {},
	): ComponentFixture<AmountStepperComponent> {
		if (options.value !== undefined) control.setValue(options.value);
		const fixture = TestBed.createComponent(AmountStepperComponent);
		fixture.componentRef.setInput('control', control);
		if (options.min !== undefined) fixture.componentRef.setInput('min', options.min);
		if (options.max !== undefined) fixture.componentRef.setInput('max', options.max);
		if (options.step !== undefined) fixture.componentRef.setInput('step', options.step);
		if (options.disabled !== undefined) fixture.componentRef.setInput('disabled', options.disabled);
		fixture.detectChanges();
		return fixture;
	}

	it('should create', () => {
		const fixture = createFixture();
		expect(fixture.componentInstance).toBeTruthy();
	});

	describe('increment', () => {
		it('should increment value by default step (100)', () => {
			const fixture = createFixture({ value: 0 });
			fixture.componentInstance.increment();
			expect(control.value).toBe(100);
		});

		it('should increment value by a custom step', () => {
			const fixture = createFixture({ value: 10, step: 5 });
			fixture.componentInstance.increment();
			expect(control.value).toBe(15);
		});

		it('should not increment beyond max', () => {
			const fixture = createFixture({ value: 100, max: 100 });
			fixture.componentInstance.increment();
			expect(control.value).toBe(100);
		});

		it('should mark control as dirty after increment', () => {
			const fixture = createFixture({ value: 0 });
			fixture.componentInstance.increment();
			expect(control.dirty).toBeTrue();
		});
	});

	describe('decrement', () => {
		it('should decrement value by default step (100)', () => {
			const fixture = createFixture({ value: 200 });
			fixture.componentInstance.decrement();
			expect(control.value).toBe(100);
		});

		it('should decrement value by a custom step', () => {
			const fixture = createFixture({ value: 15, step: 5 });
			fixture.componentInstance.decrement();
			expect(control.value).toBe(10);
		});

		it('should not decrement below min', () => {
			const fixture = createFixture({ value: 0, min: 0 });
			fixture.componentInstance.decrement();
			expect(control.value).toBe(0);
		});

		it('should mark control as dirty after decrement', () => {
			const fixture = createFixture({ value: 200 });
			fixture.componentInstance.decrement();
			expect(control.dirty).toBeTrue();
		});
	});

	describe('isAtMin / isAtMax', () => {
		it('isAtMin should be true when value equals min', () => {
			const fixture = createFixture({ value: 0, min: 0 });
			expect(fixture.componentInstance.isAtMin()).toBeTrue();
		});

		it('isAtMin should be false when value is above min', () => {
			const fixture = createFixture({ value: 50, min: 0 });
			expect(fixture.componentInstance.isAtMin()).toBeFalse();
		});

		it('isAtMin should be false when no min is set', () => {
			const fixture = createFixture({ value: 0 });
			expect(fixture.componentInstance.isAtMin()).toBeFalse();
		});

		it('isAtMax should be true when value equals max', () => {
			const fixture = createFixture({ value: 100, max: 100 });
			expect(fixture.componentInstance.isAtMax()).toBeTrue();
		});

		it('isAtMax should be false when value is below max', () => {
			const fixture = createFixture({ value: 50, max: 100 });
			expect(fixture.componentInstance.isAtMax()).toBeFalse();
		});

		it('isAtMax should be false when no max is set', () => {
			const fixture = createFixture({ value: 100 });
			expect(fixture.componentInstance.isAtMax()).toBeFalse();
		});
	});

	describe('disabled', () => {
		it('should disable the form control when disabled input is true', () => {
			createFixture({ disabled: true });
			expect(control.disabled).toBeTrue();
		});

		it('should re-enable the form control when disabled changes from true to false', () => {
			const fixture = createFixture({ disabled: true });
			expect(control.disabled).toBeTrue();
			fixture.componentRef.setInput('disabled', false);
			fixture.detectChanges();
			expect(control.enabled).toBeTrue();
		});

		it('should not change control state when disabled is false initially', () => {
			createFixture({ disabled: false });
			expect(control.enabled).toBeTrue();
		});
	});

	describe('precision', () => {
		it('should have precision 0 for integer step', () => {
			const fixture = createFixture({ step: 100 });
			expect(fixture.componentInstance.precision()).toBe(0);
		});

		it('should have precision 1 for step with one decimal place', () => {
			const fixture = createFixture({ step: 0.1 });
			expect(fixture.componentInstance.precision()).toBe(1);
		});

		it('should have precision 2 for step with two decimal places', () => {
			const fixture = createFixture({ step: 0.01 });
			expect(fixture.componentInstance.precision()).toBe(2);
		});

		it('should round increment correctly using step precision', () => {
			const fixture = createFixture({ value: 0, step: 0.1 });
			fixture.componentInstance.increment();
			// Without proper rounding, floating point gives 0.1000000...01
			expect(control.value).toBe(0.1);
		});
	});
});
