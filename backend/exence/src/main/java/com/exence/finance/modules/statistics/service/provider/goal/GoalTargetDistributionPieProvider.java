package com.exence.finance.modules.statistics.service.provider.goal;

import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class GoalTargetDistributionPieProvider implements GoalWidgetDataProvider {

    private final GoalRepository goalRepository;

    @Override
    public GoalWidgetType getSupportedType() {
        return GoalWidgetType.GOAL_TARGET_DISTRIBUTION_PIE;
    }

    @Override
    public DistributionPayload getData(WidgetRequest request) {
        List<Goal> goals = goalRepository.findByStatusIn(List.of(GoalStatus.ACTIVE, GoalStatus.PAUSED));

        List<DistributionItem> items = goals.stream()
                .map(g -> new DistributionItem(
                        g.getTitle(),
                        g.getTargetBaseCurrencyAmount(),
                        g.getCategory().getColor()))
                .toList();

        return new DistributionPayload(getSupportedType(), items);
    }
}
