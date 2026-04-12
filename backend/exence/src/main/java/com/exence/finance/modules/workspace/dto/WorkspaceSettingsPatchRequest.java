package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.dto.SupportedCurrency;

public record WorkspaceSettingsPatchRequest(SupportedCurrency baseCurrency, Boolean showBaseCurrency) {}
