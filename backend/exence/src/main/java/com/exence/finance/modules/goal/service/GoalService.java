package com.exence.finance.modules.goal.service;

import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.enums.GoalStatus;
import java.util.List;

public interface GoalService {

    Goal getGoal(Long id);

    List<GoalGetDTO> getGoalsByStatuses(List<GoalStatus> statuses);

    GoalGetDTO getGoalById(Long id);

    GoalGetDTO createGoal(GoalCreateDTO dto);

    GoalGetDTO patchGoal(Long id, GoalPatchDTO dto);

    void deleteGoal(Long id);

    int expireOverdueGoals();
}
