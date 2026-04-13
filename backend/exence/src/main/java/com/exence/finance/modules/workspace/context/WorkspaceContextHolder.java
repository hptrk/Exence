package com.exence.finance.modules.workspace.context;

import lombok.experimental.UtilityClass;

@UtilityClass
public class WorkspaceContextHolder {

    private static final ThreadLocal<Long> CONTEXT = new ThreadLocal<>();

    public static void setWorkspaceId(Long workspaceId) {
        CONTEXT.set(workspaceId);
    }

    public static Long getWorkspaceId() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }

    public static boolean isSet() {
        return CONTEXT.get() != null;
    }
}
