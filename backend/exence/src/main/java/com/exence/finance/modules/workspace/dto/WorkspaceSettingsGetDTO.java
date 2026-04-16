package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Workspace Settings Get DTO", description = "Used for retrieving the settings of a workspace.")
public record WorkspaceSettingsGetDTO(
        @Schema(description = "Base currency of the workspace.", example = "HUF") SupportedCurrency baseCurrency,
        @Schema(
                        description = "Whether to show amounts in the base currency alongside the original transaction"
                                + " currency.",
                        example = "true")
                boolean showBaseCurrency) {}
