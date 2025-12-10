package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.User;

public interface TokenValidationService {

    User validateAndExtractUser(String token, TokenType expectedType);

    boolean isTokenValid(String token, TokenType expectedType);

    boolean isTokenActive(String jwtId);

}