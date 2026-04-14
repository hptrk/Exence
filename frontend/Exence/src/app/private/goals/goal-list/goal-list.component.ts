import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@jsverse/transloco';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { GoalGet } from '../../../data-model/modules/goal/GoalGet';
import { GoalStatus } from '../../../data-model/modules/goal/GoalStatus';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { CurrencyService } from '../../../shared/currency.service';
import { ColumnDef, DataTableComponent, TableAction } from '../../../shared/data-table/data-table.component';
import { ExCellDirective } from '../../../shared/data-table/ex-cell.directive';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SvgIcons } from '../../../shared/svg-icons/svg-icons';
import { localizeCurrency } from '../../../shared/util/utils';
import { CategoryStore } from '../../transactions-and-categories/category.store';
import { GoalCreate } from '../../../data-model/modules/goal/GoalCreate';
import { GoalPatch } from '../../../data-model/modules/goal/GoalPatch';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { CreateGoalDialogComponent } from '../create-goal-dialog/create-goal-dialog.component';
import { EditGoalDialogComponent, EditGoalDialogData } from '../edit-goal-dialog/edit-goal-dialog.component';
import { GoalStore } from '../goal.store';

export interface GoalModel extends GoalGet {
	category?: CategoryGet | undefined;
}

@Component({
	selector: 'ex-goal-list',
	templateUrl: './goal-list.component.html',
	styleUrl: './goal-list.component.scss',
	imports: [
		CommonModule,
		MatIconModule,
		MatTooltipModule,
		MatLabel,
		MatProgressBarModule,
		DataTableComponent,
		ExCellDirective,
		TranslatePipe,
		CurrencyPipe,
	],
})
export class GoalListComponent {
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);
	private readonly store = inject(GoalStore);
	private readonly categoryStore = inject(CategoryStore);
	private readonly dialog = inject(DialogService);
	readonly display = inject(DisplaySizeService);

	title = input<string>('');
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();

	data = computed<GoalModel[]>(() => {
		const categories = this.categoryStore.categoryResource.value();

		const raw = this.store.goals();
		if (!raw.length) return [];

		return raw.map(g => ({
			...g,
			category: categories?.find(c => c.id === g.categoryId),
		}));
	});

	isLoading = computed<boolean>(() => this.store.goalResource.isLoading());

	columns = computed<ColumnDef[]>(() => {
		const columns: ColumnDef[] = [];
		columns.push({ key: 'title', header: 'goals.titleLabel', width: '35%' });
		if (this.display.isMd()) columns.push({ key: 'deadline', header: 'goals.date', width: '70px' });
		columns.push({ key: 'amount', header: 'literals.amount', width: '120px' });
		columns.push({ key: 'category', header: 'literals.category', width: '50px' });
		columns.push({ key: 'actions', header: '', width: '60px' });
		return columns;
	});

	showBaseCurrency = computed<boolean>(() => this.currencyService.showBaseCurrency());

	baseCurrency = computed<SupportedCurrency>(() => this.currencyService.baseCurrency());

	actions: TableAction<GoalModel>[] = [
		{
			label: 'literals.edit',
			icon: 'edit',
			handler: row => this.edit(row),
		},
		{
			label: 'literals.delete',
			icon: 'delete',
			color: 'var(--error-color)',
			handler: row => this.store.deleteGoal(row.id),
		},
	];

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	codeForStatus(status: GoalStatus): TranslationCode {
		return `goals.status.${status}`;
	}

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateGoalDialogComponent, undefined);
		if (!result) return;
		this.store.createGoal(result as GoalCreate);
	}

	private async edit(row: GoalModel): Promise<void> {
		const result = await this.dialog.openNonModal<EditGoalDialogData, GoalPatch>(EditGoalDialogComponent, {
			goal: row,
		});
		if (!result) return;
		this.store.updateGoal(row.id, result);
	}
}
