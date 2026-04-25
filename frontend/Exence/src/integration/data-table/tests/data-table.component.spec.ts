import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';
import { PagedResponse } from '../../../app/data-model/modules/common/PagedResponse';
import { DataTableComponent } from '../../../app/shared/data-table/data-table.component';
import { ExCellDirective } from '../../../app/shared/data-table/ex-cell.directive';
import { DisplaySizeService } from '../../../app/shared/display-size.service';
import { ACTIONS, ACTIONS_WITH_DISABLED, COLUMNS, ROWS, TestRow } from '../data/data-table.data';
import {
	getAllCustomCells,
	getAllDataRows,
	getAllMenuTriggerBtns,
	getAddBtn,
	getEmptyState,
	getFooterRow,
	getInlineActionBtns,
	getInlineActionNativeBtn,
	getSkeletonLoader,
	getTableHeaderIcon,
	getTableTitle,
} from '../locators/data-table.locators';

const mockTransloco = {
	translate: (key: string) => key,
	config: { reRenderOnLangChange: false },
	langChanges$: EMPTY,
	_loadDependencies: () => EMPTY,
};

const mockDisplay = {
	isSm: signal(true),
	isMd: signal(true),
	getObserverByName: () => signal(true),
};

const SHARED_PROVIDERS = [
	provideNoopAnimations(),
	{ provide: DisplaySizeService, useValue: mockDisplay },
	{ provide: TranslocoService, useValue: mockTransloco },
];

// Host component that provides a real TemplateRef for expansion tests
@Component({
	template: `
		<ng-template #tpl let-row
			><span class="detail">{{ row.name }}</span></ng-template
		>
		<ex-data-table [columns]="columns" [data]="rows" [expandTemplate]="tpl" [nonExpandable]="nonExpandable" />
	`,
	standalone: true,
	imports: [DataTableComponent],
})
class ExpandTestHost {
	columns = COLUMNS;
	rows = ROWS;
	nonExpandable = false;
}

@Component({
	template: `
		<ex-data-table [columns]="columns" [data]="rows">
			<ng-template exCell="name" let-row>
				<span data-testid="custom-cell">CUSTOM:{{ row.name }}</span>
			</ng-template>
		</ex-data-table>
	`,
	standalone: true,
	imports: [DataTableComponent, ExCellDirective],
})
class CellTemplateHost {
	columns = COLUMNS;
	rows = ROWS;
}

describe('DataTableComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DataTableComponent],
			providers: SHARED_PROVIDERS,
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(DataTableComponent);
		fixture.componentRef.setInput('columns', COLUMNS);
		fixture.detectChanges();
		expect(fixture.componentInstance).toBeTruthy();
	});

	describe('displayedColumns', () => {
		it('should return column keys from columns input', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.detectChanges();
			expect(fixture.componentInstance.displayedColumns()).toEqual(['name', 'actions']);
		});
	});

	describe('empty state', () => {
		it('should show empty state when no data and not loading', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.detectChanges();
			expect(fixture.componentInstance.isEmpty()).toBeTrue();
			expect(getEmptyState(fixture.nativeElement)).toBeTruthy();
		});

		it('should not show empty state when data is provided', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.detectChanges();
			expect(fixture.componentInstance.isEmpty()).toBeFalse();
			expect(getEmptyState(fixture.nativeElement)).toBeNull();
		});

		it('should not show empty state when loading even with no data', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('isLoading', true);
			fixture.detectChanges();
			expect(fixture.componentInstance.isEmpty()).toBeFalse();
		});
	});

	describe('data display', () => {
		it('should display a row for each item in a plain array', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.detectChanges();
			expect(getAllDataRows(fixture.nativeElement).length).toBe(ROWS.length);
		});

		it('should display a row for each item in a PagedResponse', () => {
			const pagedData: PagedResponse<TestRow> = {
				content: ROWS,
				page: 0,
				size: 10,
				totalElements: 3,
				totalPages: 1,
				first: true,
				last: true,
				numberOfElements: 3,
			};
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', pagedData);
			fixture.detectChanges();
			expect(getAllDataRows(fixture.nativeElement).length).toBe(ROWS.length);
		});
	});

	describe('skeleton loader', () => {
		it('should show skeleton loader footer row when loading', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('isLoading', true);
			fixture.detectChanges();
			expect(getSkeletonLoader(fixture.nativeElement)).toBeTruthy();
			expect((getFooterRow(fixture.nativeElement) as HTMLElement)?.hidden).toBeFalse();
		});

		it('should hide skeleton loader footer row when not loading', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.componentRef.setInput('isLoading', false);
			fixture.detectChanges();
			expect((getFooterRow(fixture.nativeElement) as HTMLElement)?.hidden).toBeTrue();
		});
	});

	describe('outputs', () => {
		it('should emit addClicked when the add button is clicked', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.detectChanges();
			const addClickedSpy = jasmine.createSpy('addClicked');
			fixture.componentInstance.addClicked.subscribe(addClickedSpy);
			(getAddBtn(fixture.nativeElement) as HTMLElement).click();
			expect(addClickedSpy).toHaveBeenCalled();
		});

		it('should emit scrolled when the scrolled output fires', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.detectChanges();
			const scrolledSpy = jasmine.createSpy('scrolled');
			fixture.componentInstance.scrolled.subscribe(scrolledSpy);
			fixture.componentInstance.scrolled.emit();
			expect(scrolledSpy).toHaveBeenCalled();
		});
	});

	describe('actions', () => {
		it('should render inline action buttons when inlineActions is true', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.componentRef.setInput('actions', ACTIONS);
			fixture.componentRef.setInput('inlineActions', true);
			fixture.detectChanges();
			expect(getInlineActionBtns(fixture.nativeElement).length).toBe(ROWS.length * ACTIONS.length);
		});
	});

	describe('header rendering', () => {
		it('should render the title when provided', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('title', 'My Table');
			fixture.detectChanges();
			expect(getTableTitle(fixture.nativeElement)!.textContent).toContain('My Table');
		});

		it('should render a mat-icon when matIcon is provided', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('matIcon', 'home');
			fixture.detectChanges();
			expect(getTableHeaderIcon(fixture.nativeElement)!.textContent).toContain('home');
		});
	});

	describe('actions menu (non-inline)', () => {
		it('should render a menu trigger button per row', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.componentRef.setInput('actions', ACTIONS);
			fixture.detectChanges();
			expect(getAllMenuTriggerBtns(fixture.nativeElement).length).toBe(ROWS.length);
		});

		it('should NOT render inline buttons when inlineActions is false', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.componentRef.setInput('actions', ACTIONS);
			fixture.detectChanges();
			expect(getInlineActionBtns(fixture.nativeElement).length).toBe(0);
		});

		it('should invoke the action handler when called directly', () => {
			const handlerSpy = jasmine.createSpy('handler');
			const actionsWithSpy = [{ label: 'Edit', icon: 'edit', handler: handlerSpy }];
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.componentRef.setInput('actions', actionsWithSpy);
			fixture.detectChanges();
			actionsWithSpy[0].handler(ROWS[0]);
			expect(handlerSpy).toHaveBeenCalledWith(ROWS[0]);
		});
	});

	describe('disabled actions predicate', () => {
		it('should disable the button for a row matching the disabled predicate', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.componentRef.setInput('actions', ACTIONS_WITH_DISABLED);
			fixture.componentRef.setInput('inlineActions', true);
			fixture.detectChanges();
			expect(getInlineActionNativeBtn(fixture.nativeElement, 0).disabled).toBeTrue();
		});

		it('should not disable the button for a row not matching the predicate', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.componentRef.setInput('actions', ACTIONS_WITH_DISABLED);
			fixture.componentRef.setInput('inlineActions', true);
			fixture.detectChanges();
			expect(getInlineActionNativeBtn(fixture.nativeElement, 1).disabled).toBeFalse();
		});
	});

	describe('expansion with no expandTemplate provided', () => {
		it('should not expand when expandTemplate is not provided', () => {
			const fixture = TestBed.createComponent(DataTableComponent);
			fixture.componentRef.setInput('columns', COLUMNS);
			fixture.componentRef.setInput('data', ROWS);
			fixture.detectChanges();
			fixture.componentInstance.toggleExpand(ROWS[0]);
			expect(fixture.componentInstance.expandedRowId()).toBeNull();
		});
	});
});

describe('DataTableComponent custom cell template', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CellTemplateHost],
			providers: SHARED_PROVIDERS,
		}).compileComponents();
	});

	it('should render custom cell template for a column', () => {
		const fixture = TestBed.createComponent(CellTemplateHost);
		fixture.detectChanges();
		const customCells = getAllCustomCells(fixture.nativeElement);
		expect(customCells.length).toBe(ROWS.length);
		expect(customCells[0].textContent).toContain('CUSTOM:Alpha');
	});
});

describe('DataTableComponent row expansion (with real TemplateRef)', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ExpandTestHost],
			providers: SHARED_PROVIDERS,
		}).compileComponents();
	});

	function getDataTable(
		fixture: ReturnType<typeof TestBed.createComponent<ExpandTestHost>>,
	): DataTableComponent<TestRow> {
		return fixture.debugElement.query(By.directive(DataTableComponent))
			.componentInstance as DataTableComponent<TestRow>;
	}

	it('should expand a row when toggleExpand is called', () => {
		const fixture = TestBed.createComponent(ExpandTestHost);
		fixture.detectChanges();
		const dt = getDataTable(fixture);
		dt.toggleExpand(ROWS[0]);
		expect(dt.expandedRowId()).toBe(ROWS[0].id);
	});

	it('should collapse an expanded row on second toggleExpand', () => {
		const fixture = TestBed.createComponent(ExpandTestHost);
		fixture.detectChanges();
		const dt = getDataTable(fixture);
		dt.toggleExpand(ROWS[0]);
		dt.toggleExpand(ROWS[0]);
		expect(dt.expandedRowId()).toBeNull();
	});

	it('should not expand when nonExpandable is true', () => {
		const fixture = TestBed.createComponent(ExpandTestHost);
		fixture.componentInstance.nonExpandable = true;
		fixture.detectChanges();
		const dt = getDataTable(fixture);
		dt.toggleExpand(ROWS[0]);
		expect(dt.expandedRowId()).toBeNull();
	});
});
