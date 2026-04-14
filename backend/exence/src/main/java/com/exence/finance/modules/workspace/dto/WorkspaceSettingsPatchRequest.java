package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        title = "Workspace Settings Patch Request DTO",
        description = "For updating workspace settings. All fields are optional.")
public record WorkspaceSettingsPatchRequest(
        @Schema(description = "New base currency for the workspace.", example = "EUR") SupportedCurrency baseCurrency,
        @Schema(
                        description = "Whether to show amounts in the base currency alongside the original transaction"
                                + " currency.",
                        example = "false")
                Boolean showBaseCurrency) {}
