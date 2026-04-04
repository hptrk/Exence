package com.exence.finance.modules.auth.dto.response;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;

public record AuthenticationResponse(@Valid UserDTO user, @JsonIgnore TokenPair tokens) {}
