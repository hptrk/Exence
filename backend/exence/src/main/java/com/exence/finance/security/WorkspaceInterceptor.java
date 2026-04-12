package com.exence.finance.security;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.service.WorkspaceMembershipService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class WorkspaceInterceptor implements HandlerInterceptor {

    private static final String WORKSPACE_ID_HEADER = "X-Workspace-ID";

    private final WorkspaceMembershipService workspaceMembershipService;
    private final UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Bare workspace collection endpoints do not require a workspace context
        if ("/api/workspaces".equals(uri) && ("GET".equals(method) || "POST".equals(method))) {
            return true;
        }

        String headerValue = request.getHeader(WORKSPACE_ID_HEADER);
        if (headerValue == null) {
            throw new ExenceException(ErrorCode.WORKSPACE_HEADER_MISSING);
        }

        Long workspaceId;
        try {
            workspaceId = Long.parseLong(headerValue);
        } catch (NumberFormatException e) {
            throw new ExenceException(ErrorCode.WORKSPACE_HEADER_MISSING);
        }

        Long userId = userService.getCurrentUserId();
        workspaceMembershipService.validateMembership(userId, workspaceId);
        WorkspaceContextHolder.setWorkspaceId(workspaceId);

        return true;
    }

    @Override
    public void afterCompletion(
            HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        WorkspaceContextHolder.clear();
    }
}
