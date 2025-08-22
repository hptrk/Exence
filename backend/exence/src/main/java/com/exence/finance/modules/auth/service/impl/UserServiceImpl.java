package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.auth.dto.UserDTO;
import com.exence.finance.modules.auth.dto.request.DeleteUserRequest;
import com.exence.finance.modules.auth.dto.request.UpdatePasswordRequest;
import com.exence.finance.modules.auth.dto.request.UpdateUserRequest;
import com.exence.finance.modules.auth.dto.response.EmptyAuthResponse;
import com.exence.finance.modules.auth.dto.response.UserResponse;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.mapper.UserMapper;
import com.exence.finance.modules.auth.repository.TokenRepository;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.transaction.entity.Transaction;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        return userId;
    }

    public UserResponse updateUser(UpdateUserRequest request){
        UserDTO userDTO = request.getUser();
        Long userId = getUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        userMapper.updateUserFromDto(userDTO, user);

        return UserResponse.builder()
                .user(userMapper.mapToUserDto(user))
                .build();
    }

    public EmptyAuthResponse updatePassword(UpdatePasswordRequest request) {
        Long userId = getUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        // TODO: validation for updating password (e.g oldpassword check)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return EmptyAuthResponse.builder().build();
    }

    public EmptyAuthResponse deleteUser(DeleteUserRequest request) {
        Long userId = getUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        // Delete all tokens associated with the user
        List<Token> tokens = tokenRepository.findAllValidTokenByUser(user.getId());
        tokenRepository.deleteAll(tokens);

        // Delete all transactions associated with the user
        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());
        transactionRepository.deleteAll(transactions);

        // Delete all categories associated with the user
        List<Category> categories = categoryRepository.findByUserId(user.getId());
        categoryRepository.deleteAll(categories);

        // Delete the user
        userRepository.deleteById(userId);

        return EmptyAuthResponse.builder().build();
    }
}
