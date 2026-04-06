package com.exence.finance.modules.auth.dto;

public record UserGetDTO(Long id, String username, String email, boolean isVerified) {}
