package com.exence.finance.modules.auth.dto;

import com.exence.finance.common.annotations.ValidStrictEmail;
import com.exence.finance.common.annotations.ValidUsername;

public record UserDTO(Long id, @ValidUsername String username, @ValidStrictEmail String email, boolean isVerified) {}
