package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.modules.auth.controller.UserController;
import com.exence.finance.modules.auth.dto.request.DeleteUserRequest;
import com.exence.finance.modules.auth.dto.request.UpdatePasswordRequest;
import com.exence.finance.modules.auth.dto.request.UpdateUserRequest;
import com.exence.finance.modules.auth.dto.response.EmptyAuthResponse;
import com.exence.finance.modules.auth.dto.response.UserResponse;
import com.exence.finance.modules.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserControllerImpl implements UserController {
    private final UserService userService;

    @PostMapping("/updateUser")
    public UserResponse updateUser(UpdateUserRequest request){
        UserResponse response = userService.updateUser(request);
        return response;
    }

    @PostMapping("/updatePassword")
    public EmptyAuthResponse updatePassword(UpdatePasswordRequest request){
        EmptyAuthResponse response = userService.updatePassword(request);
        return response;
    }

    @PostMapping("/deleteUser")
    public EmptyAuthResponse deleteUser(DeleteUserRequest request) {
        EmptyAuthResponse response = userService.deleteUser(request);
        return response;
    }
}
