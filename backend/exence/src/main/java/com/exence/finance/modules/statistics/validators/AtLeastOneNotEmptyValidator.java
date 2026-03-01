package com.exence.finance.modules.statistics.validators;

import com.exence.finance.modules.statistics.annotations.AtLeastOneNotEmpty;
import com.exence.finance.modules.statistics.dto.UpdateLayoutRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AtLeastOneNotEmptyValidator implements ConstraintValidator<AtLeastOneNotEmpty, UpdateLayoutRequest> {

    @Override
    public boolean isValid(UpdateLayoutRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }

        boolean hasStatCards =
                request.statCards() != null && !request.statCards().isEmpty();
        boolean hasCharts = request.charts() != null && !request.charts().isEmpty();

        return hasStatCards || hasCharts;
    }
}
