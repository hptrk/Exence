package com.exence.finance.modules.statistics.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.response.WidgetDataResponse;
import com.exence.finance.modules.statistics.dto.response.WidgetLayoutResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Widgets", description = "Dashboard widget layout and data retrieval")
public interface WidgetController {

    @ExenceOpenApi(
            summary = "Get the dashboard widget layout",
            description = "Returns the full widget layout for the active workspace's Statistics dashboard, split into"
                    + " stat-card widgets and chart widgets.",
            successStatus = 200,
            successDescription = "Widget layout returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.EMAIL_VERIFICATION_REQUIRED})
    ResponseEntity<WidgetLayoutResponse> getLayout();

    @ExenceOpenApi(
            summary = "Get data for a specific widget",
            description = "Computes and returns the data payload for the widget identified by its ID. An optional"
                    + " timeframe query parameter overrides the widget's stored timeframe. The appropriate"
                    + " data provider is selected based on the widget's type.",
            successStatus = 200,
            successDescription = "Widget data payload returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.WIDGET_NOT_FOUND,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<WidgetDataResponse> getWidgetData(
            @Parameter(description = "ID of the widget to retrieve data for", required = true) Long widgetId,
            Timeframe timeframe);

    @ExenceOpenApi(
            summary = "Get dashboard balance trend data",
            description =
                    "Returns the data payload for the Balance Trend widget on the Dashboard. An optional timeframe"
                            + " query parameter overrides the widget's default timeframe.",
            successStatus = 200,
            successDescription = "Dashboard balance trend data returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.WIDGET_NOT_FOUND, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<WidgetDataResponse> getDashboardBalanceTrend(Timeframe timeframe);

    @ExenceOpenApi(
            summary = "Create a new widget",
            description = "Adds a new statistics widget to the active workspace's dashboard. The widget type determines"
                    + " which data provider is used. Widget-specific settings are validated before"
                    + " persistence. Returns the updated full layout after creation.",
            successStatus = 200,
            successDescription = "Updated widget layout returned after creation.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.INVALID_WIDGET_SETTING,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<WidgetLayoutResponse> createWidget(WidgetCreateDTO widgetCreateDTO);

    @ExenceOpenApi(
            summary = "Update the dashboard widget layout",
            description = "Replaces the entire widget layout for the active workspace. Stat-card widgets in the request"
                    + " are updated with new display order and optional settings/title. Chart widgets are"
                    + " updated with position (x, y), size (cols, rows), and optional settings/title."
                    + " Widgets present in the stored layout but absent from the request are deleted.",
            successStatus = 200,
            successDescription = "Updated widget layout returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EMAIL_VERIFICATION_REQUIRED,
                ErrorCode.WIDGET_NOT_FOUND,
                ErrorCode.INVALID_WIDGET_SETTING,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<WidgetLayoutResponse> updateLayout(UpdateLayoutRequest request);
}
