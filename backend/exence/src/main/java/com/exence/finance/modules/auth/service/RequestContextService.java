package com.exence.finance.modules.auth.service;

public interface RequestContextService {
    String extractUserAgent();

    String extractIpAddress();

    String extractAuthorizationHeader();

    String extractBearerToken();
}