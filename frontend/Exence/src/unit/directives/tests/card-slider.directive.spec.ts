import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardSliderDirective } from '../../../app/shared/card-slider.directive';

@Component({
	template: `
		<div style="width: 300px;">
			<div cardSlider [shortCards]="shortCards" style="display: flex;">
				<div class="card">Card 1</div>
				<div class="card">Card 2</div>
				<div class="card">Card 3</div>
			</div>
		</div>
	`,
	imports: [CardSliderDirective],
})
class HostComponent {
	@Input() shortCards = false;
}

function mockComputedStyle(sliderEl: HTMLElement): void {
	spyOn(window, 'getComputedStyle').and.callFake((target: Element) => {
		if (target === sliderEl) {
			return { gap: '8', paddingLeft: '0', paddingRight: '0' } as unknown as CSSStyleDeclaration;
		}
		return { minWidth: '0' } as unknown as CSSStyleDeclaration;
	});
}

function setupOverflow(fixture: ComponentFixture<HostComponent>, sliderEl: HTMLElement, parentEl: HTMLElement): void {
	Object.defineProperty(parentEl, 'clientWidth', { value: 100, configurable: true });
	Object.defineProperty(sliderEl, 'scrollWidth', { value: 400, configurable: true });
	const cards = Array.from(sliderEl.children) as HTMLElement[];
	cards.forEach(card => Object.defineProperty(card, 'offsetWidth', { value: 120, configurable: true }));
	mockComputedStyle(sliderEl);
	fixture.detectChanges();
}

function setupNoOverflow(fixture: ComponentFixture<HostComponent>, sliderEl: HTMLElement, parentEl: HTMLElement): void {
	Object.defineProperty(parentEl, 'clientWidth', { value: 600, configurable: true });
	Object.defineProperty(sliderEl, 'scrollWidth', { value: 400, configurable: true });
	const cards = Array.from(sliderEl.children) as HTMLElement[];
	cards.forEach(card => Object.defineProperty(card, 'offsetWidth', { value: 100, configurable: true }));
	spyOn(window, 'getComputedStyle').and.callFake((target: Element) => {
		if (target === sliderEl) {
			return { gap: '8', paddingLeft: '0', paddingRight: '0' } as unknown as CSSStyleDeclaration;
		}
		return { minWidth: '100' } as unknown as CSSStyleDeclaration;
	});
	fixture.detectChanges();
}

async function createFixture(shortCards = false): Promise<{
	fixture: ComponentFixture<HostComponent>;
	sliderEl: HTMLElement;
	parentEl: HTMLElement;
}> {
	const fixture = TestBed.createComponent(HostComponent);
	fixture.componentInstance.shortCards = shortCards;
	const sliderEl = fixture.nativeElement.querySelector('[cardSlider]') as HTMLElement;
	const parentEl = sliderEl.parentElement!;
	return { fixture, sliderEl, parentEl };
}

describe('CardSliderDirective', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
		}).compileComponents();
	});

	describe('overflow scenario — shortCards false', () => {
		let fixture: ComponentFixture<HostComponent>;
		let sliderEl: HTMLElement;

		beforeEach(async () => {
			({ fixture, sliderEl } = await createFixture(false));
			setupOverflow(fixture, sliderEl, sliderEl.parentElement!);
		});

		it('adds overflow-x-auto class', () => {
			expect(sliderEl.classList.contains('overflow-x-auto')).toBeTrue();
		});

		it('adds pb-1 class', () => {
			expect(sliderEl.classList.contains('pb-1')).toBeTrue();
		});

		it('sets 45% min-width on child cards', () => {
			(Array.from(sliderEl.children) as HTMLElement[]).forEach(card => {
				expect(card.style.minWidth).toBe('45%');
			});
		});
	});

	describe('overflow scenario — shortCards true', () => {
		let fixture: ComponentFixture<HostComponent>;
		let sliderEl: HTMLElement;

		beforeEach(async () => {
			({ fixture, sliderEl } = await createFixture(true));
			setupOverflow(fixture, sliderEl, sliderEl.parentElement!);
		});

		it('sets 90% min-width on child cards when shortCards is true', () => {
			(Array.from(sliderEl.children) as HTMLElement[]).forEach(card => {
				expect(card.style.minWidth).toBe('90%');
			});
		});
	});

	describe('no overflow scenario', () => {
		let fixture: ComponentFixture<HostComponent>;
		let sliderEl: HTMLElement;

		beforeEach(async () => {
			({ fixture, sliderEl } = await createFixture(false));
			setupNoOverflow(fixture, sliderEl, sliderEl.parentElement!);
		});

		it('does not add overflow-x-auto class when content fits', () => {
			expect(sliderEl.classList.contains('overflow-x-auto')).toBeFalse();
		});

		it('sets flex: 1 1 0 on child elements', () => {
			(Array.from(sliderEl.children) as HTMLElement[]).forEach(card => {
				expect(card.style.flex).toContain('1 1 0');
			});
		});

		it('resets minWidth to auto on child elements', () => {
			(Array.from(sliderEl.children) as HTMLElement[]).forEach(card => {
				expect(card.style.minWidth).toBe('auto');
			});
		});
	});
});
