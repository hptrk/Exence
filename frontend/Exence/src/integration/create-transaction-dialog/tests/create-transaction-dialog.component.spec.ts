import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslocoService } from '@jsverse/transloco';
import { signal } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/locale';
import { EMPTY } from 'rxjs';
import { CreateTransactionDialogComponent } from '../../../app/private/transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { CategoryService } from '../../../app/private/transactions-and-categories/category.service';
import { CurrencyService } from '../../../app/shared/currency.service';
import { DialogRef } from '../../../app/shared/dialog/dialog.service';
import { ExchangeRateService } from '../../../app/shared/exchange-rate.service';
import { DayOfWeek } from '../../../app/data-model/modules/transaction/DayOfWeek';
import { EndCondition } from '../../../app/data-model/modules/transaction/EndCondition';
import { RecurrenceFrequency } from '../../../app/data-model/modules/transaction/RecurrenceFrequency';
import { TransactionType } from '../../../app/data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { MOCK_CATEGORIES } from '../data/create-transaction-dialog.data';
import {
	getCreateBtn,
	getDayOfMonthSelector,
	getDayOfWeekSelector,
	getRecurringConfig,
} from '../locators/create-transaction-dialog.locators';

const mockTransloco = {
	translate: (key: string) => key,
	config: { reRenderOnLangChange: false },
	langChanges$: EMPTY,
	_loadDependencies: () => EMPTY,
	getActiveLang: () => 'en',
};

describe('CreateTransactionDialogComponent', () => {
	let fixture: ComponentFixture<CreateTransactionDialogComponent>;
	let component: CreateTransactionDialogComponent;
	let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
	let exchangeRateServiceSpy: jasmine.SpyObj<ExchangeRateService>;
	let dialogCloseSpy: jasmine.Spy;
	let dialogSubmitSpy: jasmine.Spy;
	let mockDialogRef: DialogRef<unknown, unknown>;

	async function setup(dialogData?: unknown): Promise<void> {
		categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['list']);
		categoryServiceSpy.list.and.returnValue(Promise.resolve(MOCK_CATEGORIES));

		exchangeRateServiceSpy = jasmine.createSpyObj('ExchangeRateService', ['getRate']);
		exchangeRateServiceSpy.getRate.and.returnValue(Promise.resolve(1.0));

		dialogCloseSpy = jasmine.createSpy('close');
		dialogSubmitSpy = jasmine.createSpy('submit');

		mockDialogRef = new DialogRef(dialogCloseSpy, dialogData);
		spyOn(mockDialogRef, 'submit').and.callFake(dialogSubmitSpy);

		const mockCurrencyService = { baseCurrency: signal(SupportedCurrency.EUR) };

		await TestBed.configureTestingModule({
			imports: [CreateTransactionDialogComponent],
			providers: [
				provideNoopAnimations(),
				{ provide: TranslocoService, useValue: mockTransloco },
				{ provide: CategoryService, useValue: categoryServiceSpy },
				{ provide: ExchangeRateService, useValue: exchangeRateServiceSpy },
				{ provide: CurrencyService, useValue: mockCurrencyService },
				{ provide: DialogRef, useValue: mockDialogRef },
				provideDateFnsAdapter(),
				{ provide: MAT_DATE_LOCALE, useValue: enUS },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(CreateTransactionDialogComponent);
		component = fixture.componentInstance;
	}

	afterEach(() => {
		TestBed.resetTestingModule();
	});

	describe('initialization', () => {
		beforeEach(async () => {
			await setup();
		});

		it('should create', () => {
			fixture.detectChanges();
			expect(component).toBeTruthy();
		});

		it('should default type to EXPENSE when no dialog data provided', () => {
			fixture.detectChanges();
			expect(component.form.controls.type.value).toEqual(TransactionType.EXPENSE);
		});

		it('should pre-select type from dialog data when provided', async () => {
			TestBed.resetTestingModule();
			await setup({ type: TransactionType.INCOME });
			fixture.detectChanges();
			expect(component.form.controls.type.value).toEqual(TransactionType.INCOME);
		});

		it('should check isRecurring checkbox when data.isRecurring is true', async () => {
			TestBed.resetTestingModule();
			await setup({ isRecurring: true });
			fixture.detectChanges();
			expect(component.form.controls.recurring.controls.isRecurring.value).toBeTrue();
		});

		it('should load categories from CategoryService on init', async () => {
			fixture.detectChanges();
			await fixture.whenStable();
			expect(categoryServiceSpy.list).toHaveBeenCalledTimes(1);
		});

		it('should fetch exchange rate on init', async () => {
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(exchangeRateServiceSpy.getRate).toHaveBeenCalled();
		});
	});

	describe('filteredCategories', () => {
		beforeEach(async () => {
			await setup();
			fixture.detectChanges();
			await fixture.whenStable();
		});

		it('should show only EXPENSE and MIXED categories when type is EXPENSE', () => {
			const ids = component.filteredCategories().map(c => c.id);
			expect(ids).toEqual([1, 3]);
		});

		it('should show only INCOME and MIXED categories when type is INCOME', () => {
			component.form.controls.type.setValue(TransactionType.INCOME);
			TestBed.flushEffects();
			const ids = component.filteredCategories().map(c => c.id);
			expect(ids).toEqual([2, 3]);
		});

		it('should filter by search text case-insensitively', () => {
			component.form.controls.category.controls.searchText.setValue('gro');
			const result = component.filteredCategories();
			expect(result.length).toBe(1);
			expect(result[0].name).toBe('Groceries');
		});

		it('should return empty array when search matches nothing', () => {
			component.form.controls.category.controls.searchText.setValue('zzz');
			expect(component.filteredCategories()).toEqual([]);
		});

		it('should reset category control when type changes', () => {
			component.form.controls.category.controls.category.setValue(MOCK_CATEGORIES[0]);
			component.form.controls.type.setValue(TransactionType.INCOME);
			TestBed.flushEffects();
			expect(component.form.controls.category.controls.category.value).toBeNull();
			expect(component.form.controls.category.controls.category.pristine).toBeTrue();
		});
	});

	describe('recurring mode', () => {
		beforeEach(async () => {
			await setup();
			fixture.detectChanges();
			await fixture.whenStable();
		});

		it('should disable date and exchangeRate when isRecurring becomes true', () => {
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			TestBed.flushEffects();
			expect(component.form.controls.date.disabled).toBeTrue();
			expect(component.form.controls.exchangeRate.disabled).toBeTrue();
		});

		it('should re-enable date and exchangeRate when isRecurring becomes false', () => {
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			TestBed.flushEffects();
			component.form.controls.recurring.controls.isRecurring.setValue(false);
			TestBed.flushEffects();
			expect(component.form.controls.date.disabled).toBeFalse();
		});

		it('should show recurring config block when isRecurring is true', () => {
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			fixture.detectChanges();
			expect(getRecurringConfig(fixture.nativeElement)).toBeTruthy();
		});

		it('should hide recurring config block when isRecurring is false', () => {
			fixture.detectChanges();
			expect(getRecurringConfig(fixture.nativeElement)).toBeNull();
		});
	});

	describe('recurring frequency UI', () => {
		beforeEach(async () => {
			await setup();
			fixture.detectChanges();
			await fixture.whenStable();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			fixture.detectChanges();
		});

		it('should show day-of-week selector when frequency is WEEKLY', () => {
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.WEEKLY);
			fixture.detectChanges();
			expect(getDayOfWeekSelector(fixture.nativeElement)).toBeTruthy();
			expect(getDayOfMonthSelector(fixture.nativeElement)).toBeNull();
		});

		it('should show day-of-month grid when frequency is MONTHLY', () => {
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.MONTHLY);
			fixture.detectChanges();
			const dayOfMonthSelector = getDayOfMonthSelector(fixture.nativeElement);
			expect(dayOfMonthSelector).toBeTruthy();
			expect(dayOfMonthSelector!.querySelectorAll('.recurring-day-card').length).toBe(31);
			expect(getDayOfWeekSelector(fixture.nativeElement)).toBeNull();
		});

		it('should hide both selectors when frequency is YEARLY', () => {
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.YEARLY);
			fixture.detectChanges();
			expect(getDayOfWeekSelector(fixture.nativeElement)).toBeNull();
			expect(getDayOfMonthSelector(fixture.nativeElement)).toBeNull();
		});
	});

	describe('recurringDateFilter', () => {
		beforeEach(async () => {
			await setup();
			fixture.detectChanges();
			await fixture.whenStable();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
		});

		it('should reject past dates', () => {
			const yesterday = new Date(Date.now() - 86400000);
			expect(component.recurringDateFilter()(yesterday)).toBeFalse();
		});

		it('should filter by matching weekday when WEEKLY', () => {
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.WEEKLY);
			component.form.controls.recurring.controls.configs.controls.dayOfWeek.setValue(DayOfWeek.MONDAY);
			// Find next Monday
			const date = new Date();
			date.setDate(date.getDate() + 1);
			while (date.getDay() !== 1) {
				date.setDate(date.getDate() + 1);
			}
			expect(component.recurringDateFilter()(date)).toBeTrue();
			// Tuesday in the future
			const tuesday = new Date(date);
			tuesday.setDate(tuesday.getDate() + 1);
			expect(component.recurringDateFilter()(tuesday)).toBeFalse();
		});

		it('should filter by matching day-of-month when MONTHLY', () => {
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.MONTHLY);
			component.form.controls.recurring.controls.configs.controls.dayOfMonth.setValue(15);
			// A future date with day 15
			const futureDate15 = new Date();
			futureDate15.setMonth(futureDate15.getMonth() + 1);
			futureDate15.setDate(15);
			expect(component.recurringDateFilter()(futureDate15)).toBeTrue();
			// A future date with day 16
			const futureDate16 = new Date(futureDate15);
			futureDate16.setDate(16);
			expect(component.recurringDateFilter()(futureDate16)).toBeFalse();
		});

		it('should accept any future date when frequency is YEARLY', () => {
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.YEARLY);
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 1);
			expect(component.recurringDateFilter()(futureDate)).toBeTrue();
		});
	});

	describe('exchange rate fetching', () => {
		it('should disable exchangeRate control during fetch', async () => {
			await setup();
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			// Re-trigger only the exchange rate effect by changing currency.
			// The isRecurring effect won't re-run (its dependency hasn't changed),
			// so the disable() set by the exchange rate effect is not overridden.
			exchangeRateServiceSpy.getRate.and.returnValue(new Promise(() => {}));
			component.form.controls.currency.setValue(SupportedCurrency.USD);
			TestBed.flushEffects();
			expect(component.form.controls.exchangeRate.disabled).toBeTrue();
		});

		it('should set exchangeRate value after successful fetch', async () => {
			await setup();
			exchangeRateServiceSpy.getRate.and.returnValue(Promise.resolve(1.25));
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(component.form.getRawValue().exchangeRate).toEqual(1.25);
		});

		it('should use today instead of a future date for exchange rate request', async () => {
			await setup();
			fixture.detectChanges();
			TestBed.flushEffects();
			await fixture.whenStable();
			// Set a future date
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 1);
			component.form.controls.date.setValue(futureDate);
			TestBed.flushEffects();
			await fixture.whenStable();
			const calls = exchangeRateServiceSpy.getRate.calls.mostRecent();
			const requestDate: Date = calls.args[0].date;
			const today = new Date();
			expect(requestDate.toDateString()).toEqual(today.toDateString());
		});
	});

	describe('form validation', () => {
		beforeEach(async () => {
			await setup();
			fixture.detectChanges();
			await fixture.whenStable();
		});

		it('should be invalid on init', () => {
			expect(component.form.invalid).toBeTrue();
		});

		it('should be valid with all required fields filled (non-recurring)', async () => {
			component.form.controls.title.setValue('Test Transaction');
			component.form.controls.amount.setValue(100);
			component.form.controls.category.controls.category.setValue(MOCK_CATEGORIES[0]);
			TestBed.flushEffects();
			await fixture.whenStable();
			expect(component.form.valid).toBeTrue();
		});

		it('should be invalid when amount is below 1', () => {
			component.form.controls.title.setValue('Test');
			component.form.controls.amount.setValue(0);
			component.form.controls.category.controls.category.setValue(MOCK_CATEGORIES[0]);
			expect(component.form.invalid).toBeTrue();
		});

		it('should be invalid when title exceeds 255 characters', () => {
			component.form.controls.title.setValue('a'.repeat(256));
			expect(component.form.controls.title.invalid).toBeTrue();
		});

		it('should disable Create button when form is invalid', () => {
			fixture.detectChanges();
			expect(getCreateBtn(fixture.nativeElement)!.querySelector('button')!.hasAttribute('disabled')).toBeTrue();
		});
	});

	describe('create()', () => {
		beforeEach(async () => {
			await setup();
			fixture.detectChanges();
			await fixture.whenStable();
		});

		function fillRequiredFields(): void {
			component.form.controls.title.setValue('Test Transaction');
			component.form.controls.amount.setValue(100);
			component.form.controls.category.controls.category.setValue(MOCK_CATEGORIES[0]);
		}

		it('should call dialogRef.submit with a TransactionCreate when not recurring', () => {
			fillRequiredFields();
			component.form.controls.recurring.controls.isRecurring.setValue(false);
			component.create();
			expect(dialogSubmitSpy).toHaveBeenCalledWith(
				jasmine.objectContaining({
					title: 'Test Transaction',
					amount: 100,
					type: TransactionType.EXPENSE,
					categoryId: MOCK_CATEGORIES[0].id,
					date: jasmine.any(String),
				}),
			);
			const submitted = dialogSubmitSpy.calls.mostRecent().args[0];
			expect(submitted.frequency).toBeUndefined();
			expect(submitted.startDate).toBeUndefined();
		});

		it('should call dialogRef.submit with RecurringTransactionCreate when recurring', () => {
			fillRequiredFields();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.WEEKLY);
			component.form.controls.recurring.controls.configs.controls.endCondition.setValue(EndCondition.NEVER);
			component.create();
			expect(dialogSubmitSpy).toHaveBeenCalledWith(
				jasmine.objectContaining({
					frequency: RecurrenceFrequency.WEEKLY,
					interval: jasmine.any(Number),
					startDate: jasmine.any(String),
					endCondition: EndCondition.NEVER,
				}),
			);
			const submitted = dialogSubmitSpy.calls.mostRecent().args[0];
			expect(submitted.date).toBeUndefined();
			expect(submitted.exchangeRate).toBeUndefined();
		});

		it('should include dayOfWeek when frequency is WEEKLY', () => {
			fillRequiredFields();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.WEEKLY);
			component.create();
			const submitted = dialogSubmitSpy.calls.mostRecent().args[0];
			expect(submitted.dayOfWeek).toBeDefined();
		});

		it('should NOT include dayOfWeek when frequency is MONTHLY', () => {
			fillRequiredFields();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.MONTHLY);
			component.create();
			const submitted = dialogSubmitSpy.calls.mostRecent().args[0];
			expect(submitted.dayOfWeek).toBeUndefined();
		});

		it('should include dayOfMonth when frequency is MONTHLY', () => {
			fillRequiredFields();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			component.form.controls.recurring.controls.configs.controls.frequency.setValue(RecurrenceFrequency.MONTHLY);
			component.create();
			const submitted = dialogSubmitSpy.calls.mostRecent().args[0];
			expect(submitted.dayOfMonth).toBeDefined();
		});

		it('should include endDate when endCondition is UNTIL_DATE', () => {
			fillRequiredFields();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			component.form.controls.recurring.controls.configs.controls.endCondition.setValue(EndCondition.UNTIL_DATE);
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 1);
			component.form.controls.recurring.controls.configs.controls.endDate.setValue(futureDate);
			component.create();
			const submitted = dialogSubmitSpy.calls.mostRecent().args[0];
			expect(submitted.endDate).toEqual(jasmine.any(String));
		});

		it('should include maxOccurrences when endCondition is AFTER_OCCURRENCES', () => {
			fillRequiredFields();
			component.form.controls.recurring.controls.isRecurring.setValue(true);
			component.form.controls.recurring.controls.configs.controls.endCondition.setValue(
				EndCondition.AFTER_OCCURRENCES,
			);
			component.form.controls.recurring.controls.configs.controls.maxOccurrences.setValue(5);
			component.create();
			const submitted = dialogSubmitSpy.calls.mostRecent().args[0];
			expect(submitted.maxOccurrences).toBe(5);
		});
	});

	describe('close()', () => {
		beforeEach(async () => {
			await setup();
			fixture.detectChanges();
		});

		it('should call dialogRef.close with null', async () => {
			spyOn(mockDialogRef, 'close').and.callThrough();
			await component.close();
			expect(mockDialogRef.close).toHaveBeenCalledWith(null);
		});
	});
});
