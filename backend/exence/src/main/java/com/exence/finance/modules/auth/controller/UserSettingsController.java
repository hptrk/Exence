package com.exence.finance.modules.auth.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import org.springframework.http.ResponseEntity;

public interface UserSettingsController {
    @ExenceOpenApi(
            summary = "Get user settings",
            description = "Returns the application settings for the currently authenticated user, including language"
                    + " preference, primary and secondary UI themes, base currency, and whether to display"
                    + " amounts in the base currency.",
            successStatus = 200,
            successDescription = "User settings returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.USER_NOT_FOUND})
    ResponseEntity<UserSettingsResponse> getUserSettings();

    @ExenceOpenApi(
            summary = "Update user settings",
            description = "Partially updates the application settings for the authenticated user. Only the fields"
                    + " provided in the request body are changed; omitted fields retain their current"
                    + " values. If the base currency is changed, all existing transaction amounts are"
                    + " automatically recalculated using historical exchange rates.",
            successStatus = 200,
            successDescription = "Updated user settings returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.USER_NOT_FOUND,
                ErrorCode.VALIDATION_ERROR,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED
            })
    ResponseEntity<UserSettingsResponse> updateUserSettings(UpdateUserSettingsRequest request);
}
