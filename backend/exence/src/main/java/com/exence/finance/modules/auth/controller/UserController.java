package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import org.springframework.http.ResponseEntity;

public interface UserController {
    public ResponseEntity<UserDTO> updateUser(UserDTO userDTO);

    public ResponseEntity<Void> changePassword(ChangePasswordRequest request);

    public ResponseEntity<Void> deleteUser();
}
