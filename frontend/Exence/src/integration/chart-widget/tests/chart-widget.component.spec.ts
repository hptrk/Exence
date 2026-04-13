import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslocoService } from '@jsverse/transloco';
import { signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { ChartWidgetComponent } from '../../../app/private/statistics/chart-widget/chart-widget.component';
import { StatisticService } from '../../../app/private/statistics/statistic.service';
import { DisplayThemeService } from '../../../app/shared/display-theme.service';
import { Timeframe } from '../../../app/data-model/modules/statistics/Timeframe';
import { WidgetType } from '../../../app/data-model/modules/statistics/widget-config.model';
import {
	MOCK_BAR_WIDGET,
	MOCK_HEATMAP_WIDGET,
	MOCK_PAYLOAD,
	MOCK_SANKEY_WIDGET,
	MOCK_STATCARD_WIDGET,
} from '../data/chart-widget.data';
import { getCardContent, getSankeyChart, getSkeletonLoader, getTimeframe } from '../locators/chart-widget.locators';

const mockTransloco = {
	translate: (key: string) => key,
	config: { reRenderOnLangChange: false },
	langChanges$: EMPTY,
	_loadDependencies: () => EMPTY,
	getActiveLang: () => 'en',
};

describe('ChartWidgetComponent', () => {
	let fixture: ComponentFixture<ChartWidgetComponent>;
	let component: ChartWidgetComponent;
	let statisticServiceSpy: jasmine.SpyObj<StatisticService>;
	let displayThemeSignal: ReturnType<typeof signal<string>>;

	afterEach(() => {
		TestBed.resetTestingModule();
	});

	beforeEach(async () => {
		statisticServiceSpy = jasmine.createSpyObj('StatisticService', ['getWidgetData']);
		statisticServiceSpy.getWidgetData.and.returnValue(
			Promise.resolve({ widgetId: 1, type: WidgetType.INCOME_EXPENSE_COLUMN, payload: MOCK_PAYLOAD }),
		);

		displayThemeSignal = signal('light');

		const mockDisplayThemeService = {
			displayThemeSignal,
		};

		await TestBed.configureTestingModule({
			imports: [ChartWidgetComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: TranslocoService, useValue: mockTransloco },
				{ provide: StatisticService, useValue: statisticServiceSpy },
				{ provide: DisplayThemeService, useValue: mockDisplayThemeService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ChartWidgetComponent);
		component = fixture.componentInstance;
	});

	describe('computed signals', () => {
		it('should compute isApexChart as true for bar widget', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(component.isApexChart()).toBeTrue();
		});

		it('should compute isApexChart as false for sankey widget', () => {
			fixture.componentRef.setInput('widget', MOCK_SANKEY_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(component.isApexChart()).toBeFalse();
		});

		it('should compute isApexChart as false for statCard widget', () => {
			fixture.componentRef.setInput('widget', MOCK_STATCARD_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(component.isApexChart()).toBeFalse();
		});

		it('should compute showTimeframe as true for a non-hidden apex widget', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(component.showTimeframe()).toBeTrue();
		});

		it('should compute showTimeframe as false for SPENDING_HEATMAP (in TIMEFRAME_HIDDEN_WIDGET_TYPES)', () => {
			fixture.componentRef.setInput('widget', MOCK_HEATMAP_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(component.showTimeframe()).toBeFalse();
		});

		it('should compute showTimeframe as false when hideTimeframe input is true', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.componentRef.setInput('hideTimeframe', true);
			fixture.detectChanges();
			expect(component.showTimeframe()).toBeFalse();
		});
	});

	describe('noRequest mode', () => {
		it('should NOT call statisticService.getWidgetData when noRequest is true and payload is provided', async () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.componentRef.setInput('noRequest', true);
			fixture.componentRef.setInput('payload', MOCK_PAYLOAD);
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(statisticServiceSpy.getWidgetData).not.toHaveBeenCalled();
		});

		it('should set isLoading to false after using provided payload', async () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.componentRef.setInput('noRequest', true);
			fixture.componentRef.setInput('payload', MOCK_PAYLOAD);
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(component.isLoading()).toBeFalse();
		});

		it('should set data signal after using provided payload', async () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.componentRef.setInput('noRequest', true);
			fixture.componentRef.setInput('payload', MOCK_PAYLOAD);
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(component.data()).not.toBeUndefined();
		});
	});

	describe('HTTP fetch mode', () => {
		it('should call statisticService.getWidgetData with correct widget id and timeframe', async () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(statisticServiceSpy.getWidgetData).toHaveBeenCalledWith(1, Timeframe.YEAR_TO_DATE);
		});

		it('should set isLoading to false after successful fetch', async () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			// The promise chain (.then → .catch → .finally) requires extra microtask
			// ticks beyond whenStable(), which resolves immediately in zoneless mode.
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
			expect(component.isLoading()).toBeFalse();
		});

		it('should set isLoading to false when HTTP fetch fails', async () => {
			statisticServiceSpy.getWidgetData.and.returnValue(Promise.reject(new Error('network')));
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
			expect(component.isLoading()).toBeFalse();
		});

		it('should NOT throw when HTTP fetch fails (error is swallowed)', async () => {
			statisticServiceSpy.getWidgetData.and.returnValue(Promise.reject(new Error('network')));
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			await expectAsync(
				(async () => {
					fixture.detectChanges();
					TestBed.flushEffects();
					await fixture.whenStable();
				})(),
			).toBeResolved();
		});
	});

	describe('non-apex chart types', () => {
		it('should set isLoading to false immediately for sankey widget', async () => {
			fixture.componentRef.setInput('widget', MOCK_SANKEY_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(component.isLoading()).toBeFalse();
		});

		it('should render ex-sankey-chart for sankey widget', () => {
			fixture.componentRef.setInput('widget', MOCK_SANKEY_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(getSankeyChart(fixture.nativeElement)).toBeTruthy();
		});
	});

	describe('template rendering', () => {
		it('should show skeleton loaders when isLoading is true and data is undefined', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			// Keep isLoading true — before async completes
			statisticServiceSpy.getWidgetData.and.returnValue(new Promise(() => {}));
			fixture.detectChanges();
			expect(getSkeletonLoader(fixture.nativeElement)).toBeTruthy();
		});

		it('should show timeframe selector when showTimeframe() is true', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(getTimeframe(fixture.nativeElement)).toBeTruthy();
		});

		it('should hide timeframe selector when showTimeframe() is false', () => {
			fixture.componentRef.setInput('widget', MOCK_HEATMAP_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect(getTimeframe(fixture.nativeElement)).toBeNull();
		});
	});

	describe('editing mode', () => {
		it('should set pointer-events to none on card-content when editing is true', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', true);
			fixture.detectChanges();
			expect((getCardContent(fixture.nativeElement) as HTMLElement).style.pointerEvents).toBe('none');
		});

		it('should set pointer-events to auto on card-content when editing is false', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			expect((getCardContent(fixture.nativeElement) as HTMLElement).style.pointerEvents).toBe('auto');
		});
	});

	describe('timeframe sync', () => {
		it('should sync timeframe signal from widget input on init', () => {
			const widget = { ...MOCK_BAR_WIDGET, timeframe: Timeframe.ONE_MONTH };
			fixture.componentRef.setInput('widget', widget);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			TestBed.flushEffects();
			expect(component.timeframe()).toEqual(Timeframe.ONE_MONTH);
		});

		it('should emit timeframeChanged when timeframe signal changes', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			const emittedValues: Timeframe[] = [];
			component.timeframeChanged.subscribe(v => emittedValues.push(v));
			component.timeframe.set(Timeframe.ONE_MONTH);
			TestBed.flushEffects();
			expect(emittedValues).toContain(Timeframe.ONE_MONTH);
		});

		it('should update timeframe when widget input changes to a different timeframe', () => {
			fixture.componentRef.setInput('widget', MOCK_BAR_WIDGET);
			fixture.componentRef.setInput('editing', false);
			fixture.detectChanges();
			const updatedWidget = { ...MOCK_BAR_WIDGET, timeframe: Timeframe.ONE_MONTH };
			fixture.componentRef.setInput('widget', updatedWidget);
			TestBed.flushEffects();
			expect(component.timeframe()).toEqual(Timeframe.ONE_MONTH);
		});
	});
});
