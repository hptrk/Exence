import { animate, state, style, transition, trigger } from '@angular/animations';
import { LowerCasePipe, NgTemplateOutlet } from '@angular/common';
import {
	afterNextRender,
	booleanAttribute,
	Component,
	computed,
	ContentChildren,
	effect,
	inject,
	Injector,
	input,
	output,
	QueryList,
	signal,
	TemplateRef,
	viewChild,
} from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { SliceResponse } from '../../data-model/modules/common/SliceResponse';
import { AnimatedSkeletonLoaderComponent } from '../animated-skeleton-loader/animated-skeleton-loader.component';
import { BaseComponent } from '../base-component/base.component';
import { ButtonComponent } from '../button/button.component';
import { DisplaySizeService } from '../display-size.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { StopPropagationDirective } from '../stop-propagation.directive';
import { SvgIcons } from '../svg-icons/svg-icons';
import { ExCellDirective } from './ex-cell.directive';
import { TranslationCode } from '../i18n/translation-types';

export interface ColumnDef {
	key: string;
	header: TranslationCode;
	width?: string;
	minWidth?: string;
}

export interface TableAction<T = unknown> {
	label: TranslationCode;
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
		MatIconModule,
		NgTemplateOutlet,
		MatTooltipModule,
		MatMenuModule,
		ButtonComponent,
		AnimatedSkeletonLoaderComponent,
		StopPropagationDirective,
		ScrollingModule,
		TranslatePipe,
		LowerCasePipe,
	],
	host: {
		'[style.--container-height]': 'height() ?? `60dvh`',
	},
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
	private readonly injector = inject(Injector);

	private viewport = viewChild<CdkVirtualScrollViewport>('viewport');

	private _subscribedViewport: CdkVirtualScrollViewport | null = null;

	columns = input.required<ColumnDef[]>();
	actions = input<TableAction<T>[]>([]);
	height = input<string>();
	data = input<PagedResponse<T> | SliceResponse<T> | T[]>();
	isLoading = input<boolean>(false);
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	title = input<string>('');
	expandTemplate = input<TemplateRef<{ $implicit: T }>>();
	nonExpandable = input(false, { transform: booleanAttribute });
	inlineActions = input(false, { transform: booleanAttribute });
	hideAddButton = input(false, { transform: booleanAttribute });

	addClicked = output<void>();
	scrolled = output<void>();

	@ContentChildren(ExCellDirective) cellTemplates!: QueryList<ExCellDirective>;

	private expandedId = signal<number | null>(null);

	readonly ITEM_SIZE = 60;

	resolvedContent = computed(() => {
		const d = this.data();
		return Array.isArray(d) ? d : (d?.content ?? []);
	});

	isEmpty = computed(() => !this.resolvedContent().length && !this.isLoading());

	gridTemplateColumns = computed(() =>
		this.columns()
			.map(c => `minmax(${c.minWidth ?? 'auto'}, ${c.width ?? 'auto'})`)
			.join(' '),
	);

	constructor() {
		super();

		effect(() => {
			const d = this.data();
			const content = Array.isArray(d) ? d : d?.content;
			const isFirstPage = Array.isArray(d) || (d as PagedResponse<T>)?.page === 0;
			if (content && isFirstPage) {
				this.scrollToTop();
				// Re-measure after data changes so CDK renders newly added items.
				afterNextRender(() => this.viewport()?.checkViewportSize(), { injector: this.injector });
			}
		});

		effect(() => {
			const viewport = this.viewport();
			if (!viewport || this._subscribedViewport === viewport) return;
			this._subscribedViewport = viewport;
			// In zoneless mode CDK measures viewport size before flex layout settles.
			// afterNextRender fires after Angular's DOM update, guaranteeing a correct clientHeight.
			afterNextRender(() => viewport.checkViewportSize(), { injector: this.injector });
			this.addSubscription(
				viewport.scrolledIndexChange.subscribe(index => {
					if (this.isLoading()) return;
					const visibleCount = Math.ceil(viewport.getViewportSize() / this.ITEM_SIZE);
					if (index + visibleCount >= this.resolvedContent().length - 3) {
						this.scrolled.emit();
					}
				}),
			);
		});
	}

	getCellTemplate(key: string): TemplateRef<unknown> | null {
		return this.cellTemplates?.find(d => d.column() === key)?.template ?? null;
	}

	isExpanded(row: T): boolean {
		return this.expandedId() === row.id;
	}

	trackById = (_i: number, item: T) => item.id;

	toggleExpand(row: T): void {
		if (this.nonExpandable() || !this.expandTemplate()) return;
		this.expandedId.update(id => (id === row.id ? null : row.id));
	}

	private scrollToTop(): void {
		this.viewport()?.scrollToOffset(0);
	}
}
