package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.request.DeleteUserRequest;
import com.exence.finance.modules.auth.dto.request.UpdatePasswordRequest;
import com.exence.finance.modules.auth.dto.request.UpdateUserRequest;
import com.exence.finance.modules.auth.dto.response.EmptyAuthResponse;
import com.exence.finance.modules.auth.dto.response.UserResponse;

public interface UserController {
    public UserResponse updateUser(UpdateUserRequest request);

    public EmptyAuthResponse updatePassword(UpdatePasswordRequest request);

    public EmptyAuthResponse deleteUser(DeleteUserRequest request);
}
