package com.exence.finance.modules.investment.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetDataResponse;
import com.exence.finance.modules.statistics.dto.investment.InvestmentWidgetType;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;

@Tag(name = "Investments", description = "Investment portfolio management and statistics")
public interface InvestmentController {

    @ExenceOpenApi(
            summary = "List investments",
            description = "Returns all investment entries belonging to the currently active workspace, in a flat list.",
            successStatus = 200,
            successDescription = "List of investments returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<List<InvestmentGetDTO>> getInvestments();

    @ExenceOpenApi(
            summary = "List investments grouped by asset",
            description = "Returns investments grouped by asset name. Each group contains the aggregated total value,"
                    + " purchase count, days since the last transaction, and the individual purchase entries.",
            successStatus = 200,
            successDescription = "Grouped investments returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<List<InvestmentGroupDTO>> getGroupedInvestments();

    @ExenceOpenApi(
            summary = "Create an investment",
            description =
                    "Records a new investment purchase for the active workspace. The currency"
                            + " field is required; if it differs from the base currency, the corresponding exchange"
                            + " rate is fetched automatically for the purchase date.",
            successStatus = 201,
            successDescription = "Investment created; Location header points to the new resource.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE,
                ErrorCode.EXCHANGE_RATE_FETCH_FAILED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<InvestmentGetDTO> createInvestment(InvestmentCreateDTO dto);

    @ExenceOpenApi(
            summary = "Update an investment",
            description = "Partially updates an investment entry identified by its ID. Only the fields provided in the"
                    + " request body are modified.",
            successStatus = 200,
            successDescription = "Updated investment returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.INVESTMENT_NOT_FOUND, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<InvestmentGetDTO> patchInvestment(Long id, InvestmentPatchDTO dto);

    @ExenceOpenApi(
            summary = "Delete an investment",
            description = "Permanently deletes an investment entry identified by its ID.",
            successStatus = 204,
            successDescription = "Investment deleted successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.INVESTMENT_NOT_FOUND})
    ResponseEntity<Void> deleteInvestment(Long id);

    @ExenceOpenApi(
            summary = "Get investment widget data",
            description =
                    "Returns computed statistics data for the specified investment widget type. The payload structure"
                            + " varies depending on the widget type (e.g., stat card vs. chart).",
            successStatus = 200,
            successDescription = "Investment widget data returned.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.INVESTMENT_WIDGET_TYPE_NOT_SUPPORTED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<InvestmentWidgetDataResponse> getWidgetData(InvestmentWidgetType type);
}
