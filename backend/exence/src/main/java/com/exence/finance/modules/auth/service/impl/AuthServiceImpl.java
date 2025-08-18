package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.common.exception.AuthenticationFailedException;
import com.exence.finance.common.exception.EmailAlreadyInUseException;
import com.exence.finance.common.exception.UserNotFoundException;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.dto.request.AuthenticateRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import com.exence.finance.modules.auth.dto.response.EmptyAuthResponse;
import com.exence.finance.modules.auth.entity.Token;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.mapper.UserMapper;
import com.exence.finance.modules.auth.repository.TokenRepository;
import com.exence.finance.modules.auth.repository.UserRepository;
import com.exence.finance.modules.auth.service.AuthService;
import com.exence.finance.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    // Register the user and generate a token
    public AuthenticationResponse register(RegisterRequest request) {
        // Check if the email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyInUseException("Email is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .user(userMapper.mapToUserDto(savedUser))
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
    // Authenticate the user and generate a token
    public AuthenticationResponse authenticate(AuthenticateRequest request){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (Exception e) {
            throw new AuthenticationFailedException("Invalid username or password");
        }
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UserNotFoundException("User not found"));

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .user(userMapper.mapToUserDto(user))
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();

    }

    // Refresh the token
    // TODO: rethink token refreshing logic entirely
    public EmptyAuthResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return EmptyAuthResponse.builder().build();
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new UserNotFoundException("User not found"));

            if (jwtService.isTokenValid(refreshToken, user)){
                String accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);

                // Send the new token as a response
                AuthenticationResponse authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                response.setContentType("application/json");

                // TODO
                try{
                    new ObjectMapper().writeValue(response.getOutputStream(), authResponse);

                } catch(Exception e){

                }
            }
        }
        return EmptyAuthResponse.builder().build();
    }

    // Save the token to the database
    private void saveUserToken(User user, String jwtToken){
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }
    // Revoke all tokens for a user
    private void revokeAllUserTokens(User user){
        List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()){
            return;
        }
        // Set all valid tokens to expired and revoked
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        // Save the updated tokens
        tokenRepository.saveAll(validUserTokens);
    }
}
