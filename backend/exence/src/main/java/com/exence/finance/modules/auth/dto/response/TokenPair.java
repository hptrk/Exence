package com.exence.finance.modules.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(title = "Token Pair DTO", description = "Contains both access and refresh tokens.")
public record TokenPair(String accessToken, String refreshToken) {}
