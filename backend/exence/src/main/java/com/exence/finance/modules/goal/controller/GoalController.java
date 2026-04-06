package com.exence.finance.modules.goal.controller;

import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface GoalController {

    ResponseEntity<List<GoalGetDTO>> getGoals(List<GoalStatus> statuses);

    ResponseEntity<GoalGetDTO> getGoalById(Long id);

    ResponseEntity<GoalGetDTO> createGoal(GoalCreateDTO dto);

    ResponseEntity<GoalGetDTO> patchGoal(Long id, GoalPatchDTO dto);

    ResponseEntity<Void> deleteGoal(Long id);

    ResponseEntity<GoalWidgetDataResponse> getWidgetData(GoalWidgetType type, Timeframe timeframe, Long goalId);
}
