package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.util.ValidationConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(
        title = "Workspace Create Request DTO",
        description = "Used for creating a new workspace. Contains the necessary information to set up a workspace.")
public record WorkspaceCreateRequest(
        @Schema(
                        description =
                                "The name of the workspace. This is a required field and must not be blank. The name should be"
                                        + " concise and descriptive, as it will be used to identify the workspace.",
                        example = "Winston's Workspace")
                @NotBlank
                @Size(max = ValidationConstants.WORKSPACE_NAME_MAX_LENGTH)
                String name,
        @Schema(
                        description =
                                "The base currency for the workspace. This is a required field and must be a valid ISO 4217"
                                        + " currency code (e.g., 'USD', 'EUR'). The base currency will be used for displaying"
                                        + " financial information and performing currency conversions within the workspace.",
                        example = "HUF")
                @NotNull
                SupportedCurrency baseCurrency) {}
