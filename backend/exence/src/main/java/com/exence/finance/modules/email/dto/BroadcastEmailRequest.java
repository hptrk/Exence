package com.exence.finance.modules.email.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import static com.exence.finance.common.util.ValidationConstants.EMAIL_SUBJECT_MAX_LENGTH;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(title = "Broadcast Email Request DTO", description = "For broadcasting an email to all users.")
public record BroadcastEmailRequest(
        @Schema(
                        description = "The subject of the email. Must be a max of 255 characters.",
                        example = "Exciting News from Exence!")
                @NotBlank
                @Size(max = EMAIL_SUBJECT_MAX_LENGTH)
                String subject,
        @Schema(
                        description =
                                "The HTML content of the email. This should be a well-formed HTML string. For example, you can"
                                        + " include headings, paragraphs, and links.",
                        example = "<h1>Welcome to Exence!</h1><p>We have some exciting updates to share...</p>")
                @NotBlank
                String htmlContent) {}
