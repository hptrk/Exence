package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalActiveCountStatCardProvider implements GoalWidgetDataProvider {

    private final GoalRepository goalRepository;
    private final I18nService i18n;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD;
    }

    @Override
    public StatCardPayload getData(WidgetRequest request) {
        long count = goalRepository.countByStatus(GoalStatus.ACTIVE);
        return new StatCardPayload(
                getSupportedType(), BigDecimal.valueOf(count), i18n.get("label.goals"), null, null, null, null, null);
    }
}
