package com.exence.finance.common.validators;

import com.exence.finance.common.annotations.ValidEmoji;
import com.vdurmont.emoji.EmojiParser;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EmojiValidator implements ConstraintValidator<ValidEmoji, String> {

    private boolean allowEmpty;

    @Override
    public void initialize(ValidEmoji constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return allowEmpty;
        }

        String trimmed = value.trim();

        if (!isExactlyOneEmoji(trimmed)) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Must contain exactly one emoji character"
            ).addConstraintViolation();
            return false;
        }

        return true;
    }

    private boolean isExactlyOneEmoji(String text) {
        List<String> emojis = EmojiParser.extractEmojis(text);

        if (emojis.size() != 1) {
            return false;
        }

        String textWithoutEmojis = EmojiParser.removeAllEmojis(text);
        return textWithoutEmojis.trim().isEmpty();
    }
}