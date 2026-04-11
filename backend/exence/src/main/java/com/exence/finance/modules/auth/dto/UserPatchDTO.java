package com.exence.finance.modules.auth.dto;

import com.exence.finance.common.annotations.ValidUsername;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "User Patch DTO", description = "Used for updating user information.")
public record UserPatchDTO(
        @Schema(
                        description =
                                "The username for the user account. Can only contain letters, numbers, underscores and spaces."
                                        + " This username is used for authentication and login.",
                        example = "Winston")
                @ValidUsername
                String username) {}
