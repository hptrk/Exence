package com.exence.finance.modules.debt.dto;

import static com.exence.finance.common.util.ValidationConstants.DEBT_COUNTERPARTY_NAME_MAX_LENGTH;
import static com.exence.finance.common.util.ValidationConstants.DEBT_TITLE_MAX_LENGTH;

import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record DebtPatchDTO(
        @Size(max = DEBT_TITLE_MAX_LENGTH, message = "{validation.debt.title.size}") String title,
        @Size(max = DEBT_COUNTERPARTY_NAME_MAX_LENGTH, message = "{validation.debt.counterparty-name.size}")
                String counterpartyName,
        LocalDate deadline,
        DebtType type,
        DebtStatus status,
        Long categoryId) {}
