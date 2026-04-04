package com.exence.finance.modules.auth.controller;

import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import org.springframework.http.ResponseEntity;

public interface UserController {
    ResponseEntity<UserGetDTO> getCurrentUser();

    ResponseEntity<UserGetDTO> updateUser(UserPatchDTO request);

    ResponseEntity<Void> changePassword(ChangePasswordRequest request);

    ResponseEntity<Void> deleteUser();
}
