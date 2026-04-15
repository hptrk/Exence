package com.exence.finance.modules.statistics.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Widgets (Admin)", description = "Admin-only platform-wide statistics widgets")
public interface AdminWidgetController {
    @ExenceOpenApi(
            summary = "Get admin statistics widget data",
            description = "Returns the data payload for the specified admin statistics widget type. Admin widgets"
                    + " provide platform-wide aggregated data (e.g. total users, total transactions)"
                    + " and are accessible only to users with the ADMIN role. An optional timeframe"
                    + " parameter limits the data range; defaults to ALL_TIME.",
            successStatus = 200,
            successDescription = "Admin widget data payload returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.ACCESS_DENIED,
                ErrorCode.ADMIN_WIDGET_TYPE_NOT_SUPPORTED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<AdminWidgetDataResponse> getWidgetData(
            @Parameter(description = "Type of admin statistics widget", required = true) AdminWidgetType type,
            Timeframe timeframe);
}
