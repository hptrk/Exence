package com.exence.finance.modules.auth.dto.response;

import com.exence.finance.modules.auth.dto.Theme;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
        title = "User Settings Response DTO",
        description = "Contains the current settings for an authenticated user. This information is used to display the"
                + " user's preferences in the UI and to ensure that the application behaves according to their"
                + " chosen settings.")
public record UserSettingsResponse(
        @Schema(
                        description =
                                "The preferred language for the user interface. Must be a valid ISO 639-1 language code (e.g.,"
                                        + " 'en' for English, 'es' for Spanish). This setting will determine the language used in"
                                        + " the application's UI and notifications.",
                        example = "en")
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
                Theme secondaryTheme) {}
