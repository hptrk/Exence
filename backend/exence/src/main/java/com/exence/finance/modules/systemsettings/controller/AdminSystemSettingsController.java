package com.exence.finance.modules.systemsettings.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsPatchRequest;
import com.exence.finance.modules.systemsettings.dto.SystemSettingsResponse;
import org.springframework.http.ResponseEntity;

public interface AdminSystemSettingsController {

    @ExenceOpenApi(
            summary = "Get system settings",
            description = "Returns the current global system settings. Accessible only by admins.",
            successStatus = 200,
            successDescription = "System settings returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.ACCESS_DENIED})
    ResponseEntity<SystemSettingsResponse> getSettings();

    @ExenceOpenApi(
            summary = "Update system settings",
            description =
                    "Partially updates the global system settings. Only the fields provided in the request body are"
                            + " modified. Accessible only by administrators.",
            successStatus = 200,
            successDescription = "Updated system settings returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.ACCESS_DENIED, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<SystemSettingsResponse> updateSettings(SystemSettingsPatchRequest request);
}
