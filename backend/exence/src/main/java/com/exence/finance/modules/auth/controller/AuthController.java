package com.exence.finance.modules.auth.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.auth.dto.request.EmailVerificationRequest;
import com.exence.finance.modules.auth.dto.request.ForgotPasswordRequest;
import com.exence.finance.modules.auth.dto.request.LoginRequest;
import com.exence.finance.modules.auth.dto.request.PasswordResetRequest;
import com.exence.finance.modules.auth.dto.request.RegisterRequest;
import com.exence.finance.modules.auth.dto.response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface AuthController {

    @ExenceOpenApi(
            summary = "Register a new user",
            description =
                    "Registers a new user with the provided information, assigns the USER role, creates default user"
                            + " settings and dashboard widgets, sends an email verification message, and stores"
                            + " authentication tokens in HttpOnly cookies.",
            successStatus = 200,
            successDescription = "User registered successfully with authentication tokens in cookies.",
            errors = {ErrorCode.EMAIL_ALREADY_IN_USE, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<AuthenticationResponse> register(RegisterRequest request);

    @ExenceOpenApi(
            summary = "Log in with email and password",
            description = "Authenticates a user by verifying the provided email and password. On success, the previous"
                    + " session from the same device (identified by user-agent and IP address) is revoked to"
                    + " prevent duplicate active sessions, and new access and refresh tokens are issued and"
                    + " stored in HttpOnly cookies.",
            successStatus = 200,
            successDescription = "Login successful with authentication tokens in cookies.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<AuthenticationResponse> login(LoginRequest request);

    @ExenceOpenApi(
            summary = "Refresh the access token",
            description = "Issues a new access token using the refresh token present in the HttpOnly cookie. The old"
                    + " access token for the current session is revoked, and the new one is written back"
                    + " into the cookie. The refresh token itself remains unchanged.",
            successStatus = 204,
            successDescription = "New access token issued and set in cookie.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.INVALID_TOKEN, ErrorCode.JWT_TOKEN_EXPIRED})
    ResponseEntity<Void> refreshToken(HttpServletRequest request);

    @ExenceOpenApi(
            summary = "Verify email address",
            description = "Confirms the user's email address using a one-time verification token sent by email. Once"
                    + " verified, all pending email-verification tokens for the user are revoked and a"
                    + " welcome email is dispatched.",
            successStatus = 204,
            successDescription = "Email address verified successfully.",
            errors = {
                ErrorCode.INVALID_TOKEN,
                ErrorCode.JWT_TOKEN_EXPIRED,
                ErrorCode.EMAIL_ALREADY_VERIFIED,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<Void> verifyEmail(EmailVerificationRequest request);

    @ExenceOpenApi(
            summary = "Request a password-reset email",
            description = "Looks up the account associated with the given email address and sends a password-reset link"
                    + " containing a short-lived token. Any previously issued password-reset tokens for the"
                    + " user are revoked before a new one is created. Rate-limited to prevent email flooding.",
            successStatus = 204,
            successDescription = "Password-reset email dispatched (if an account with that address exists).",
            errors = {ErrorCode.TOO_MANY_EMAILS, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<Void> forgotPassword(ForgotPasswordRequest request);

    @ExenceOpenApi(
            summary = "Reset password using a reset token",
            description = "Sets a new password for the account identified by the password-reset token. The new password"
                    + " must not match the current password or any of the recent password-history entries."
                    + " On success, all active tokens for the user (access, refresh, password-reset) are"
                    + " revoked to force a fresh login.",
            successStatus = 204,
            successDescription = "Password reset successfully; all sessions invalidated.",
            errors = {
                ErrorCode.INVALID_TOKEN,
                ErrorCode.JWT_TOKEN_EXPIRED,
                ErrorCode.INVALID_PASSWORD,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<Void> resetPassword(PasswordResetRequest request);
}
