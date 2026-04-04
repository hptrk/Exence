package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.mapper.UserMapper;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.AuthService;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.PasswordHistoryService;
import com.exence.finance.modules.auth.service.PasswordValidationService;
import com.exence.finance.modules.auth.service.RequestContextService;
import com.exence.finance.modules.auth.service.TokenManagementService;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final TokenManagementService tokenManagementService;
    private final PasswordValidationService passwordValidationService;
    private final PasswordHistoryService passwordHistoryService;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final RequestContextService requestContextService;
    private final AuthService authService;

    @ReadTransactional
    public UserGetDTO getUserFromToken() {
        HttpServletRequest request = requestContextService.getCurrentRequest();
        if (request == null) {
            throw new ExenceException(ErrorCode.USER_NOT_FOUND);
        }

        String token = cookieService.extractAccessTokenFromCookie(request);
        if (token == null) {
            throw new ExenceException(ErrorCode.USER_NOT_FOUND);
        }

        String email = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ExenceException(ErrorCode.USER_NOT_FOUND));
        return userMapper.mapToUserGetDto(user);
    }

    @ReadTransactional
    @Cacheable(
            value = "currentUser",
            key = "#root.methodName + '_' + "
                    + "T(org.springframework.security.core.context.SecurityContextHolder)"
                    + ".getContext().getAuthentication().getName()")
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ExenceException(ErrorCode.USER_NOT_FOUND);
        }

        return loadUserFromAuthentication(authentication);
    }

    @ReadTransactional
    @Cacheable(
            value = "currentUserId",
            key = "T(org.springframework.security.core.context.SecurityContextHolder)"
                    + ".getContext().getAuthentication().getName()")
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    @WriteTransactional
    @CacheEvict(
            value = {"currentUser", "currentUserId"},
            allEntries = true)
    public UserGetDTO updateUser(UserPatchDTO request) {
        User user = getCurrentUser();
        userMapper.updateUserFromPatchDto(request, user);
        user = userRepository.save(user);

        return userMapper.mapToUserGetDto(user);
    }

    @WriteTransactional
    @CacheEvict(
            value = {"currentUser", "currentUserId"},
            allEntries = true)
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        passwordValidationService.validatePasswordChange(user, request.oldPassword(), request.newPassword());

        String oldPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        passwordHistoryService.savePasswordToHistory(user, oldPassword);
        tokenManagementService.revokeAllUserTokens(user);
    }

    @Override
    @WriteTransactional
    public void requestVerifyEmail() {
        User user = getCurrentUser();

        if (user.getEmailVerified()) {
            throw new ExenceException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }

        authService.sendEmailVerification(user);

        log.info("Email verification resent for user: {}", user.getEmail());
    }

    @WriteTransactional
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
            return userRepository.findByEmail(email).orElseThrow(() -> new ExenceException(ErrorCode.USER_NOT_FOUND));
        }
        if (principal instanceof UserDetails userDetails) {
            String email = userDetails.getUsername();
            return userRepository.findByEmail(email).orElseThrow(() -> new ExenceException(ErrorCode.USER_NOT_FOUND));
        }

        throw new ExenceException(ErrorCode.USER_NOT_FOUND);
    }
}
