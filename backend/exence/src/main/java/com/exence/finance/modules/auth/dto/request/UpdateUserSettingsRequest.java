package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.ValidLanguage;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.auth.dto.Theme;

public record UpdateUserSettingsRequest(
        @ValidLanguage String language,
        Theme primaryTheme,
        Theme secondaryTheme,
        SupportedCurrency baseCurrency,
        Boolean showBaseCurrency) {}
