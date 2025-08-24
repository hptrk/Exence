package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.auth.controller.UserController;
import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserControllerImpl implements UserController {
    private final UserService userService;

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO updated = userService.updateUser(userDTO);
        return ResponseFactory.ok(updated);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseFactory.noContent();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser() {
        userService.deleteUser();
        return ResponseFactory.noContent();
    }
}
