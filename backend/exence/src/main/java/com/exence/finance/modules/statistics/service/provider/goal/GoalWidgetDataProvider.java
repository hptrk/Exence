package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.WidgetDataPayload;

public sealed interface GoalWidgetDataProvider
        permits GoalActiveCountStatCardProvider,
                GoalAvgProgressStatCardProvider,
                GoalCompletionRateStatCardProvider,
                GoalNextDeadlineStatCardProvider,
                GoalProgressTrendProvider,
                GoalTargetDistributionPieProvider,
                GoalTotalSavedThisYearStatCardProvider,
                GoalTotalSavingsStatCardProvider {

    GoalWidgetType getSupportedType();

    WidgetDataPayload getData(WidgetRequest request);
}
