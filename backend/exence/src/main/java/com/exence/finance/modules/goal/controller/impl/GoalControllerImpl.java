package com.exence.finance.modules.goal.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.goal.controller.GoalController;
import com.exence.finance.modules.goal.dto.GoalCreateDTO;
import com.exence.finance.modules.goal.dto.GoalGetDTO;
import com.exence.finance.modules.goal.dto.GoalPatchDTO;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.service.GoalService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.service.GoalWidgetService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class GoalControllerImpl implements GoalController {

    private final GoalService goalService;
    private final GoalWidgetService goalWidgetService;

    @GetMapping
    public ResponseEntity<List<GoalGetDTO>> getGoals(
            @RequestParam(value = "statuses", required = false) List<GoalStatus> statuses) {
        return ResponseFactory.ok(goalService.getGoalsByStatuses(statuses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalGetDTO> getGoalById(@PathVariable Long id) {
        return ResponseFactory.ok(goalService.getGoalById(id));
    }

    @PostMapping
    public ResponseEntity<GoalGetDTO> createGoal(@Valid @RequestBody GoalCreateDTO dto) {
        GoalGetDTO created = goalService.createGoal(dto);
        return ResponseFactory.created(created.id(), created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<GoalGetDTO> patchGoal(@PathVariable Long id, @Valid @RequestBody GoalPatchDTO dto) {
        return ResponseFactory.ok(goalService.patchGoal(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseFactory.noContent();
    }

    @Override
    @GetMapping("/statistics/{type}")
    public ResponseEntity<GoalWidgetDataResponse> getWidgetData(
            @PathVariable GoalWidgetType type,
            @RequestParam(required = false) Timeframe timeframe,
            @RequestParam(required = false) Long goalId) {
        return ResponseFactory.ok(goalWidgetService.getWidgetData(type, timeframe, goalId));
    }
}
