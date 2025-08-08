package com.exence.finance.modules.auth.controller.impl;

import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserControllerImpl {
    @Autowired
    private UserServiceImpl userService;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        UserDTO userDTO = userService.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/update-username")
    public ResponseEntity<UserDTO> updateUsername(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UserDTO updatedUser = userService.updateUsername(userId, username);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/update-email")
    public ResponseEntity<UserDTO> updateEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UserDTO updatedUser = userService.updateEmail(userId, email);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/update-password")
    public ResponseEntity<UserDTO> updatePassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        UserDTO updatedUser = userService.updatePassword(userId, password);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // We can create a user through registration, so we don't need this endpoint
//    @PostMapping
//    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO){
//        UserDTO createdUser = userService.createUser(userDTO);
//        return ResponseEntity.ok(createdUser);
//    }

    // Admin only
//    @PutMapping("/{id}")
//    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO){
//        UserDTO updatedUser = userService.updateUser(id, userDTO);
//        return ResponseEntity.ok(updatedUser);
//    }

    // Admin only
//    @PatchMapping("/{id}")
//    public ResponseEntity<UserDTO> patchUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
//        UserDTO updatedUser = userService.patchUser(id, updates);
//        return ResponseEntity.ok(updatedUser);

    // Admin only
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
//        userService.deleteUser(id);
//        return ResponseEntity.noContent().build();
//    }
//    }



}
