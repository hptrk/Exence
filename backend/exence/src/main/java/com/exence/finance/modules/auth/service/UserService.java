package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.request.DeleteUserRequest;
import com.exence.finance.modules.auth.dto.request.UpdatePasswordRequest;
import com.exence.finance.modules.auth.dto.request.UpdateUserRequest;
import com.exence.finance.modules.auth.dto.response.EmptyAuthResponse;
import com.exence.finance.modules.auth.dto.response.UserResponse;

public interface UserService {
    public UserResponse updateUser(UpdateUserRequest request);

    public EmptyAuthResponse updatePassword(UpdatePasswordRequest request);

    public EmptyAuthResponse deleteUser(DeleteUserRequest request);
    public Long getUserId();
}
