package com.exence.finance.modules.auth.dto.response;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.dto.Theme;

public record UserSettingsResponse(
        String language,
        Theme primaryTheme,
        Theme secondaryTheme,
        SupportedCurrency baseCurrency,
        boolean showBaseCurrency) {}
