import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
	ADMIN_CHART_TYPES,
	ADMIN_LEADERBOARD_CARD_DATA,
	ADMIN_LEADERBOARD_CARDS,
	AdminWidgetType,
} from '../../../data-model/modules/statistics/widget-config.model';
import { LeaderboardPayload, StatCardPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { LeaderboardComponent } from '../../leaderboard/leaderboard.component';
import { StatCardComponent } from '../../statistics/stat-card/stat-card.component';
import { AdminChartComponent } from './admin-chart/admin-chart.component';

export type AdminCard = (StatCardPayload | LeaderboardPayload) & { type: AdminWidgetType };

@Component({
	selector: 'ex-admin-statistics-list',
	templateUrl: './admin-statistics-list.component.html',
	styleUrl: './admin-statistics-list.component.scss',
	imports: [CommonModule, StatCardComponent, LeaderboardComponent, TranslatePipe, AdminChartComponent],
})
export class AdminStatisticsListComponent {
	readonly cardTypes = ADMIN_LEADERBOARD_CARDS;
	readonly cardData = ADMIN_LEADERBOARD_CARD_DATA;
	readonly widgetType = AdminWidgetType;
	readonly chartTypes = ADMIN_CHART_TYPES;
}
