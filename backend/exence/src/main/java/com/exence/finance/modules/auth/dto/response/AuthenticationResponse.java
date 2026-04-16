package com.exence.finance.modules.auth.dto.response;

import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(
        title = "Authentication Response DTO",
        description = "Response containing authenticated user details and workspace ID")
public record AuthenticationResponse(@Valid UserGetDTO user, @JsonIgnore TokenPair tokens, Long workspaceId) {}
