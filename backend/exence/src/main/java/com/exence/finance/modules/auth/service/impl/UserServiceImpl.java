package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.mapper.UserMapper;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Cacheable(value = "currentUser", key = "#root.methodName + '_' + T(org.springframework.security.core.context.SecurityContextHolder).getContext().getAuthentication().getName()")
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserNotFoundException();
        }

        String userEmail = authentication.getName();
        //TODO: remove log?
        log.debug("Loading user from DB: {}", userEmail);

        return loadUserFromAuthentication(authentication);
    }

    @Cacheable(value = "currentUserId", key = "T(org.springframework.security.core.context.SecurityContextHolder).getContext().getAuthentication().getName()")
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    @Transactional
    @CacheEvict(value = {"currentUser", "currentUserId"}, allEntries = true)
    public UserDTO updateUser(UserDTO userDTO){
        User user = getCurrentUser();
        userMapper.updateUserFromDto(userDTO, user);
        User savedUser = userRepository.save(user);

        return userMapper.mapToUserDto(savedUser);
    }

    @Transactional
    @CacheEvict(value = {"userSecurity", "currentUser", "currentUserId"}, allEntries = true)
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        // TODO: validation for updating password (e.g currentPassword check, old passwords check, etc.)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser() {
        User user = getCurrentUser();
        userRepository.delete(user);
    }

    private User loadUserFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user;
        }
        if (principal instanceof String email) {
            return userRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
        }
        if (principal instanceof UserDetails userDetails) {
            String email = userDetails.getUsername();
            return userRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
        }

        throw new UserNotFoundException();
    }
}
