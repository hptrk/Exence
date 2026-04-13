package com.exence.finance.modules.workspace.dto;

import com.exence.finance.common.annotations.ValidStrictEmail;

public record WorkspaceMemberEmailRequest(@ValidStrictEmail String email) {}
