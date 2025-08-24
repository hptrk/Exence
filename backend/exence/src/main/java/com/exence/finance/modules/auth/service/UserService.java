package com.exence.finance.modules.auth.service;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;

public interface UserService {
    public UserDTO updateUser(UserDTO userDTO);

    public void changePassword(ChangePasswordRequest request);

    public void deleteUser();

    public Long getUserId();
}
