package com.exence.finance.modules.auth.dto.response;

import com.exence.finance.modules.auth.dto.Theme;

public record UserSettingsResponse(String language, Theme primaryTheme, Theme secondaryTheme) {}
