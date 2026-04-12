package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.dto.SupportedCurrency;

public record WorkspaceSettingsGetDTO(SupportedCurrency baseCurrency, boolean showBaseCurrency) {}
