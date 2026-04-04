package com.exence.finance.modules.auth.dto.request;

import com.exence.finance.common.annotations.ValidUsername;

public record UpdateUserRequest(@ValidUsername String username) {}
