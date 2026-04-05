package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidRecurringTransaction;
import com.exence.finance.modules.transaction.dto.EndCondition;
import com.exence.finance.modules.transaction.dto.RecurrenceFrequency;
import com.exence.finance.modules.transaction.dto.RecurringTransactionCreateDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RecurringTransactionCreateValidator
        implements ConstraintValidator<ValidRecurringTransaction, RecurringTransactionCreateDTO> {

    @Override
    public boolean isValid(RecurringTransactionCreateDTO dto, ConstraintValidatorContext context) {
        if (dto == null) {
            return true;
        }

        boolean valid = true;
        context.disableDefaultConstraintViolation();

        if (dto.frequency() == RecurrenceFrequency.WEEKLY) {
            if (dto.dayOfWeek() == null) {
                context.buildConstraintViolationWithTemplate("{recurring.day-of-week.required}")
                        .addPropertyNode("dayOfWeek")
                        .addConstraintViolation();
                valid = false;
            } else if (dto.startDate() != null && dto.startDate().getDayOfWeek() != dto.dayOfWeek()) {
                context.buildConstraintViolationWithTemplate("{recurring.start-date.day-of-week-mismatch}")
                        .addPropertyNode("startDate")
                        .addConstraintViolation();
                valid = false;
            }
        }

        if (dto.frequency() == RecurrenceFrequency.MONTHLY && dto.dayOfMonth() == null) {
            context.buildConstraintViolationWithTemplate("{recurring.day-of-month.required}")
                    .addPropertyNode("dayOfMonth")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.endCondition() == EndCondition.UNTIL_DATE) {
            if (dto.endDate() == null) {
                context.buildConstraintViolationWithTemplate("{recurring.end-date.required}")
                        .addPropertyNode("endDate")
                        .addConstraintViolation();
                valid = false;
            } else if (dto.startDate() != null && !dto.endDate().isAfter(dto.startDate())) {
                context.buildConstraintViolationWithTemplate("{recurring.end-date.must-be-after-start}")
                        .addPropertyNode("endDate")
                        .addConstraintViolation();
                valid = false;
            }
        }

        if (dto.endCondition() == EndCondition.AFTER_OCCURRENCES && dto.maxOccurrences() == null) {
            context.buildConstraintViolationWithTemplate("{recurring.max-occurrences.required}")
                    .addPropertyNode("maxOccurrences")
                    .addConstraintViolation();
            valid = false;
        }

        return valid;
    }
}
