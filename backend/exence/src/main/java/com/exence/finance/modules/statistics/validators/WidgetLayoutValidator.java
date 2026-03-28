package com.exence.finance.modules.statistics.validators;

import com.exence.finance.modules.statistics.annotations.ValidWidgetLayout;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

@Component
public class WidgetLayoutValidator implements ConstraintValidator<ValidWidgetLayout, WidgetDTO> {

    @Override
    public boolean isValid(WidgetDTO dto, ConstraintValidatorContext context) {
        if (dto == null || dto.type() == null) {
            return true;
        }

        context.disableDefaultConstraintViolation();

        if (dto.type().isStatCard()) {
            return validateStatCard(dto, context);
        }

        if (dto.type().isGraph()) {
            return validateGraph(dto, context);
        }

        return true;
    }

    private boolean validateStatCard(WidgetDTO dto, ConstraintValidatorContext context) {
        boolean valid = true;

        if (dto.displayOrder() == null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.statcard.requires-display-order}")
                    .addPropertyNode("displayOrder")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.x() != null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.statcard.forbidden-x}")
                    .addPropertyNode("x")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.y() != null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.statcard.forbidden-y}")
                    .addPropertyNode("y")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.cols() != null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.statcard.forbidden-cols}")
                    .addPropertyNode("cols")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.rows() != null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.statcard.forbidden-rows}")
                    .addPropertyNode("rows")
                    .addConstraintViolation();
            valid = false;
        }

        return valid;
    }

    private boolean validateGraph(WidgetDTO dto, ConstraintValidatorContext context) {
        boolean valid = true;

        if (dto.x() == null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.graph.requires-x}")
                    .addPropertyNode("x")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.y() == null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.graph.requires-y}")
                    .addPropertyNode("y")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.cols() == null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.graph.requires-cols}")
                    .addPropertyNode("cols")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.rows() == null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.graph.requires-rows}")
                    .addPropertyNode("rows")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.displayOrder() != null) {
            context.buildConstraintViolationWithTemplate("{validation.widget.graph.forbidden-display-order}")
                    .addPropertyNode("displayOrder")
                    .addConstraintViolation();
            valid = false;
        }

        if (dto.type().isYtdOnly() && dto.timeframe() != null && dto.timeframe() != Timeframe.YTD) {
            context.buildConstraintViolationWithTemplate("{validation.widget.graph.ytd-only}")
                    .addPropertyNode("timeframe")
                    .addConstraintViolation();
            valid = false;
        }

        return valid;
    }
}
