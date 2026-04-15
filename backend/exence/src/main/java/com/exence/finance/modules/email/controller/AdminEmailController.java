package com.exence.finance.modules.email.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.email.dto.BroadcastEmailRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Admin Email", description = "Admin-only email broadcast operations")
public interface AdminEmailController {

    @ExenceOpenApi(
            summary = "Send a broadcast email to all users",
            description = "Sends an email with the given subject and body to every registered user in the system."
                    + " Accessible only to users with the ADMIN role. The email is dispatched"
                    + " asynchronously to each user's registered address.",
            successStatus = 200,
            successDescription = "Broadcast email dispatch initiated successfully.",
            errors = {ErrorCode.AUTHENTICATION_FAILED, ErrorCode.ACCESS_DENIED, ErrorCode.VALIDATION_ERROR})
    ResponseEntity<Void> sendBroadcastEmail(BroadcastEmailRequest request);
}
