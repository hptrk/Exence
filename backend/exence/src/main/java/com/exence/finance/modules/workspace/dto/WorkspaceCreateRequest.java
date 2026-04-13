package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.util.ValidationConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record WorkspaceCreateRequest(
        @NotBlank @Size(max = ValidationConstants.WORKSPACE_NAME_MAX_LENGTH) String name,
        @NotNull SupportedCurrency baseCurrency) {}
