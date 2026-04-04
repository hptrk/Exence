package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.entity.User;

public interface UserService {
    /**
     * Request-scoped cached getCurrentUser
     * Caches the user in a request lifecycle to avoid multiple DB calls
     */
    UserGetDTO getUserFromToken();

    User getCurrentUser();

    Long getCurrentUserId();

    UserGetDTO updateUser(UserPatchDTO request);

    void changePassword(ChangePasswordRequest request);

    void requestVerifyEmail();

    void deleteUser();
}
