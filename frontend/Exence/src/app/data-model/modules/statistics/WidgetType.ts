import {
	AdminWidgetType,
	DebtWidgetType,
	GoalWidgetType,
	InvestmentWidgetType,
	StatisticsWidgetType,
} from './widget-config.model';

export type WidgetType =
	| StatisticsWidgetType
	| AdminWidgetType
	| GoalWidgetType
	| DebtWidgetType
	| InvestmentWidgetType;
