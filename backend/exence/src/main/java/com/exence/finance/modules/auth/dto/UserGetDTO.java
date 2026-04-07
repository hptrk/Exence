package com.exence.finance.modules.auth.dto;

import com.exence.finance.modules.auth.entity.Role;

public record UserGetDTO(Long id, String username, String email, boolean isVerified, Role role) {}
