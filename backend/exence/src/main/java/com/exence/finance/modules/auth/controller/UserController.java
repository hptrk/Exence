package com.exence.finance.modules.auth.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.auth.dto.UserGetDTO;
import com.exence.finance.modules.auth.dto.UserPatchDTO;
import com.exence.finance.modules.auth.dto.request.ChangePasswordRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "User", description = "User profile management and account operations")
public interface UserController {
    @ExenceOpenApi(
            summary = "Get current user profile",
            description = "Returns the full profile of the currently authenticated user, resolved from the access token"
                    + " stored in the HttpOnly cookie. Includes personal details, role, and email"
                    + " verification status.",
            successStatus = 200,
            successDescription = "Current user profile returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.USER_NOT_FOUND})
    ResponseEntity<UserGetDTO> getCurrentUser();

    @ExenceOpenApi(
            summary = "Update current user profile",
            description = "Partially updates the profile fields of the authenticated user (e.g., username)."
                    + " Only the fields present in the request body are modified. The user cache is evicted"
                    + " after a successful update.",
            successStatus = 200,
            successDescription = "Updated user profile returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.USER_NOT_FOUND, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<UserGetDTO> updateUser(UserPatchDTO request);

    @ExenceOpenApi(
            summary = "Change password",
            description = "Changes the password of the authenticated user. The current password must be provided for"
                    + " verification. The new password must not match the current password or any of the"
                    + " recent password-history entries. On success, all active tokens for the user are"
                    + " revoked, forcing re-authentication on all devices.",
            successStatus = 204,
            successDescription = "Password changed successfully; all sessions invalidated.",
            errors = {
                ErrorCode.AUTHENTICATION_FAILED,
                ErrorCode.USER_NOT_FOUND,
                ErrorCode.INVALID_PASSWORD,
                ErrorCode.VALIDATION_ERROR
            })
    ResponseEntity<Void> changePassword(ChangePasswordRequest request);

    @ExenceOpenApi(
            summary = "Resend email verification",
            description =
                    "Sends a new email-verification link to the authenticated user's email address. Any previously"
                            + " issued verification tokens remain valid until used or expired. Returns an error if"
                            + " the email address is already verified.",
            successStatus = 204,
            successDescription = "Verification email sent.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.USER_NOT_FOUND, ErrorCode.EMAIL_ALREADY_VERIFIED})
    ResponseEntity<Void> requestVerifyEmail();

    @ExenceOpenApi(
            summary = "Delete current user account",
            description = "Permanently deletes the authenticated user's account along with all associated data."
                    + " This operation is irreversible. The user is identified from the security context.",
            successStatus = 204,
            successDescription = "User account deleted successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.USER_NOT_FOUND})
    ResponseEntity<Void> deleteUser();
}
