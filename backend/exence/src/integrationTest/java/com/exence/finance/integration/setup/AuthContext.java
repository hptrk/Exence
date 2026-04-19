package com.exence.finance.integration.setup;

import com.exence.finance.modules.auth.dto.UserGetDTO;
import io.restassured.http.Cookies;

/**
 * Holds the authentication state returned after a login or register call.
 * Passed to actors so they can attach auth cookies and the workspace header
 * to requests without knowing how they were obtained.
 */
public record AuthContext(Cookies cookies, Long workspaceId, UserGetDTO user) {}
