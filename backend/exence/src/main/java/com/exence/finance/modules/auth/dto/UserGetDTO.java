package com.exence.finance.modules.auth.dto;

import com.exence.finance.modules.auth.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "User Get DTO", description = "Used for retrieving user information.")
public record UserGetDTO(
        @Schema(description = "Unique identifier of the user", example = "1") Long id,
        @Schema(
                        description =
                                "The username for the user account. Can only contain letters, numbers, and underscores. This"
                                        + " username is used for authentication and login.",
                        example = "Winston")
                String username,
        @Schema(
                        description =
                                "The email address associated with the user account. Must be unique and in a valid email"
                                        + " format. Used for password recovery, email notifications, and account verification.",
                        example = "winston@exence.com")
                String email,
        @Schema(
                        description =
                                "Whether the user's email address has been verified. If false, the user has limited access"
                                        + " to certain features until they verify their email.",
                        example = "true")
                boolean isVerified,
        @Schema(
                        description =
                                "The role assigned to the user, determining their permissions and access level within the"
                                        + " application.",
                        example = "USER")
                Role role) {}
