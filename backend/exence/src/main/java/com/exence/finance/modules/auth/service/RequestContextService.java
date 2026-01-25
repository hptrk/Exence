package com.exence.finance.modules.auth.service;

import jakarta.servlet.http.HttpServletRequest;

public interface RequestContextService {
    HttpServletRequest getCurrentRequest();

    String extractUserAgent();

    String extractIpAddress();
}
