package com.exence.finance.modules.auth.dto.response;

import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;

public record AuthenticationResponse(@Valid UserGetDTO user, @JsonIgnore TokenPair tokens) {}
