package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.dto.request.UpdateUserRequest;
import org.springframework.http.ResponseEntity;

public interface UserController {
    ResponseEntity<UserDTO> getCurrentUser();

    ResponseEntity<UserDTO> updateUser(UpdateUserRequest request);

    ResponseEntity<Void> changePassword(ChangePasswordRequest request);

    ResponseEntity<Void> deleteUser();
}
