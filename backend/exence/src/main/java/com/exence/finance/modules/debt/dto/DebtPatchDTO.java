package com.exence.finance.modules.debt.dto;

import static com.exence.finance.common.util.ValidationConstants.DEBT_COUNTERPARTY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.DEBT_TITLE_MAX_LENGTH;

import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(
        title = "Debt Patch DTO",
        description =
                "Used for updating an existing debt entry. All fields are optional, allowing for partial updates to"
                        + " the debt entry.")
public record DebtPatchDTO(
        @Schema(description = "Title of the debt. Must be a maximum of 100 characters long.", example = "Car Loan")
                @Size(max = DEBT_TITLE_MAX_LENGTH, message = "{validation.debt.title.size}")
                String title,
        @Schema(
                        description =
                                "Name of the counterparty involved in the debt. Must be a maximum of 100 characters long.",
                        example = "John Doe")
                @Size(max = DEBT_COUNTERPARTY_NAME_MAX_LENGTH, message = "{validation.debt.counterparty-name.size}")
                String counterpartyName,
        @Schema(
                        description = "Deadline for repaying the debt. Must be a valid date in the format YYYY-MM-DD.",
                        example = "2026-12-31")
                LocalDate deadline,
        @Schema(
                        description =
                                "Type of the debt. Must be either 'LENT' or 'BORROWED'. 'LENT' indicates that the workspace has"
                                        + " lent money to someone else, while 'BORROWED' indicates that the workspace has borrowed"
                                        + " money from someone else.",
                        example = "LENT")
                DebtType type,
        @Schema(
                        description =
                                "Status of the debt. Must be one of 'ACTIVE', 'SETTLED', 'EXPIRED', or 'FORGIVEN'. 'ACTIVE'"
                                        + " indicates that the debt is currently active and has not been fully repaid. 'SETTLED'"
                                        + " indicates that the debt has been fully repaid. 'EXPIRED' indicates that the deadline"
                                        + " for repaying the debt has passed without full repayment. 'FORGIVEN' indicates that the"
                                        + " debt has been forgiven and no repayment is expected.",
                        example = "ACTIVE")
                DebtStatus status,
        @Schema(description = "ID of the category associated with the debt.", example = "1") Long categoryId) {}
