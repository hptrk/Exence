package com.exence.finance.modules.goal.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
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

    @ExenceOpenApi(
            summary = "List goals",
            description =
                    "Returns all savings goals for the authenticated user. The optional `statuses` query parameter"
                        + " accepts one or more values to filter results. If omitted, all goals regardless of status"
                        + " are returned.",
            successStatus = 200,
            successDescription = "List of goals returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.EMAIL_VERIFICATION_REQUIRED})
    ResponseEntity<List<GoalGetDTO>> getGoals(List<GoalStatus> statuses);

    @ExenceOpenApi(
            summary = "Get a goal by ID",
            description = "Returns a single savings goal belonging to the authenticated user, identified by its ID.",
            successStatus = 200,
            successDescription = "Goal returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.EMAIL_VERIFICATION_REQUIRED, ErrorCode.GOAL_NOT_FOUND})
    ResponseEntity<GoalGetDTO> getGoalById(Long id);

    @ExenceOpenApi(
            summary = "Create a new goal",
            description = "Creates a new savings goal for the authenticated user. An optional initial amount can be"
                    + " provided; if the initial amount already meets or exceeds the target, the goal is"
                    + " immediately set to COMPLETED status. Target and current amounts are also stored in"
                    + " the user's base currency using the current exchange rate.",
            successStatus = 201,
            successDescription = "Goal created; Location header points to the new resource.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<GoalGetDTO> createGoal(GoalCreateDTO dto);

    @ExenceOpenApi(
            summary = "Update a goal",
            description =
                    "Partially updates a savings goal identified by its ID. The request body can include any subset of"
                        + " updatable fields. Only the provided fields will be updated. If the updated current amount"
                        + " reaches or exceeds the target, the status is automatically set to COMPLETED and a"
                        + " goal-completed event is fired.",
            successStatus = 200,
            successDescription = "Updated goal returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.GOAL_NOT_FOUND,
                ErrorCode.CATEGORY_NOT_FOUND,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<GoalGetDTO> patchGoal(Long id, GoalPatchDTO dto);

    @ExenceOpenApi(
            summary = "Delete a goal",
            description = "Permanently deletes a savings goal identified by its ID along with its progress history.",
            successStatus = 204,
            successDescription = "Goal deleted successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.EMAIL_VERIFICATION_REQUIRED, ErrorCode.GOAL_NOT_FOUND})
    ResponseEntity<Void> deleteGoal(Long id);

    @ExenceOpenApi(
            summary = "Get goal statistics widget data",
            description =
                    "Returns the data payload for the specified goal statistics widget type. An optional timeframe"
                            + " and goalId can be provided to scope the data to a specific goal or time range."
                            + " Defaults to ALL_TIME when no timeframe is supplied.",
            successStatus = 200,
            successDescription = "Goal widget data payload returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.GOAL_WIDGET_TYPE_NOT_SUPPORTED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<GoalWidgetDataResponse> getWidgetData(GoalWidgetType type, Timeframe timeframe, Long goalId);
}
