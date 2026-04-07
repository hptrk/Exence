import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	Component,
	computed,
	ContentChildren,
	effect,
	ElementRef,
	inject,
	input,
	output,
	QueryList,
	signal,
	TemplateRef,
	viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { AnimatedSkeletonLoaderComponent } from '../animated-skeleton-loader/animated-skeleton-loader.component';
import { BaseComponent } from '../base-component/base.component';
import { ButtonComponent } from '../button/button.component';
import { DisplaySizeService } from '../display-size.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { StopPropagationDirective } from '../stop-propagation.directive';
import { SvgIcons } from '../svg-icons/svg-icons';
import { ExCellDirective } from './ex-cell.directive';

export interface ColumnDef {
	key: string;
	header: string;
	width?: string;
}

export interface TableAction<T = unknown> {
	label: string;
	icon: string;
	color?: string;
	handler: (row: T) => void;
	disabled?: (row: T) => boolean;
}

@Component({
	selector: 'ex-data-table',
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
	imports: [
		MatCardModule,
		MatTableModule,
		MatIconModule,
		NgTemplateOutlet,
		MatTooltipModule,
		MatMenuModule,
		ButtonComponent,
		AnimatedSkeletonLoaderComponent,
		StopPropagationDirective,
		InfiniteScrollDirective,
		TranslatePipe,
	],
	// TODO remove deprecated angular animations
	/* eslint-disable */
	animations: [
		trigger('expandAnimation', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('collapsed => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
			transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class DataTableComponent<T extends { id: number }> extends BaseComponent {
	readonly display = inject(DisplaySizeService);

	private scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

	columns = input.required<ColumnDef[]>();
	actions = input<TableAction<T>[]>([]);
	data = input<PagedResponse<T>>();
	isLoading = input<boolean>(false);
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	title = input<string>('');
	expandTemplate = input<TemplateRef<{ $implicit: T }>>();
	nonExpandable = input(false, { transform: booleanAttribute });
	inlineActions = input(false, { transform: booleanAttribute });

	addClicked = output<void>();
	scrolled = output<void>();

	@ContentChildren(ExCellDirective) cellTemplates!: QueryList<ExCellDirective>;

	expandedRowId = signal<number | null>(null);

	dataSource = computed(() => new MatTableDataSource(this.data()?.content ?? []));

	displayedColumns = computed(() => this.columns().map(c => c.key));

	isEmpty = computed(() => !this.data()?.content?.length && !this.isLoading());

	constructor() {
		super();

		effect(() => {
			const content = this.data()?.content;
			if (content && this.data()?.page === 0) this.scrollToTop();
		});
	}

	getCellTemplate(key: string): TemplateRef<unknown> | null {
		return this.cellTemplates?.find(d => d.column() === key)?.template ?? null;
	}

	toggleExpand(row: T): void {
		if (this.nonExpandable() || !this.expandTemplate()) return;
		this.expandedRowId.update(id => (id === row.id ? null : row.id));
	}

	private scrollToTop(): void {
		const container = this.scrollContainer()?.nativeElement;
		if (container) {
			container.scrollTop = 0;
			setTimeout(() => {
				container.scrollTop = 1;
			}, 0);
		}
	}
}
