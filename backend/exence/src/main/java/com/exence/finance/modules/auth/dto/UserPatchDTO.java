package com.exence.finance.modules.auth.dto;

import com.exence.finance.common.annotations.ValidUsername;

public record UserPatchDTO(@ValidUsername String username) {}
