package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.dto.request.UpdateUserRequest;
import com.exence.finance.modules.auth.entity.User;

public interface UserService {
    /**
     * Request-scoped cached getCurrentUser
     * Caches the user in a request lifecycle to avoid multiple DB calls
     */
    public User getCurrentUser();

    public Long getCurrentUserId();

    public UserDTO updateUser(UpdateUserRequest request);

    public void changePassword(ChangePasswordRequest request);

    public void deleteUser();
}
