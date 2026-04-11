package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.ValidLanguage;
import com.exence.finance.modules.auth.dto.Theme;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Update User Settings Request DTO", description = "Used for updating an authenticated user's settings.")
public record UpdateUserSettingsRequest(
        @Schema(
                        description =
                                "The preferred language for the user interface. Must be a valid ISO 639-1 language code (e.g.,"
                                        + " 'en' for English, 'es' for Spanish). This setting will determine the language used in"
                                        + " the application's UI and notifications.",
                        example = "en")
                @ValidLanguage
                String language,
        @Schema(
                        description =
                                "The primary theme for the user interface. This setting will determine the overall color"
                                        + " scheme and appearance of the application. This can be changed to the secondary theme"
                                        + " using the theme toggle button.",
                        example = "DARK")
                Theme primaryTheme,
        @Schema(
                        description =
                                "The secondary theme for the user interface. This can be toggled using the theme button.",
                        example = "LIGHT")
                Theme secondaryTheme,
        @Schema(
                        description =
                                "The base currency for the user's financial data. This setting will determine the currency used"
                                        + " for displaying financial information and performing currency conversions.",
                        example = "USD")
                SupportedCurrency baseCurrency,
        @Schema(
                        description =
                                "Whether to show the base currency in the UI. If true, the user will see all transactions in"
                                        + " their base currency. If false, the user will see everything in the currency the"
                                        + " transaction was logged in.",
                        example = "true")
                Boolean showBaseCurrency) {}
