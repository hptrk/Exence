package com.exence.finance.service;

import com.exence.finance.dto.UserDTO;
import com.exence.finance.exception.UserNotFoundException;
import com.exence.finance.model.Category;
import com.exence.finance.model.Token;
import com.exence.finance.model.Transaction;
import com.exence.finance.model.User;
import com.exence.finance.repository.CategoryRepository;
import com.exence.finance.repository.TokenRepository;
import com.exence.finance.repository.TransactionRepository;
import com.exence.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow( () -> new UsernameNotFoundException("User not found"));
        return convertToDTO(user);
    }

    public UserDTO updateUsername(Long id, String username) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setUsername(username);
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public UserDTO updateEmail(Long id, String email) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setEmail(email);
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public UserDTO updatePassword(Long id, String password) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(password));
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));

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
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getActualUsername())
                .email(user.getEmail())
                .build();
    }

    private User convertToEntity(UserDTO userDTO) {
        return User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .build();
    }

    // We can create a user through registration, so we don't need this endpoint
//    public UserDTO createUser(UserDTO userDTO){
//        User user = convertToEntity(userDTO);
//        User savedUser = userRepository.save(user);
//        return convertToDTO(savedUser);
//    }
    // Admin only
//    public UserDTO updateUser(Long id, UserDTO userDTO){
//        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
//        user.setUsername(userDTO.getUsername());
//        user.setEmail(userDTO.getEmail());
//        User updatedUser = userRepository.save(user);
//        return convertToDTO(updatedUser);
//    }
//
//    public UserDTO patchUser(Long id, Map<String, Object> updates) {
//        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
//        updates.forEach((key, value) -> {
//            Field field = ReflectionUtils.findField(User.class, key);
//            field.setAccessible(true);
//            ReflectionUtils.setField(field, user, value);
//        });
//        User updatedUser = userRepository.save(user);
//        return convertToDTO(updatedUser);
//    }
}
