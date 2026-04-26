package com.exence.finance.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.validators.EmailDomainValidator;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class EmailDomainValidatorTest {

    @Mock
    private ConstraintValidatorContext context;

    @Mock
    private ConstraintValidatorContext.ConstraintViolationBuilder builder;

    @Mock
    private SystemSettingsService systemSettingsService;

    @InjectMocks
    private EmailDomainValidator validator;

    private static final SystemSettings WHITELIST_OFF =
            SystemSettings.builder().domainWhitelistOnly(false).build();

    @Test
    @DisplayName("returns true for valid domains when whitelist mode is disabled")
    void validate_validDomain() {
        // given
        given(systemSettingsService.getSettings()).willReturn(WHITELIST_OFF);

        // when / then
        assertThat(validator.isValid("test@gmail.com", context)).isTrue();
        assertThat(validator.isValid("user@company.com", context)).isTrue();
    }

    @Test
    @DisplayName("returns false for blacklisted domains")
    void validate_blacklistedDomain() {
        // given
        given(context.buildConstraintViolationWithTemplate(anyString())).willReturn(builder);

        // when / then
        assertThat(validator.isValid("test@10minutemail.com", context)).isFalse();
        assertThat(validator.isValid("user@tempmail.org", context)).isFalse();
    }

    @Test
    @DisplayName("returns true for null or empty input")
    void validate_nullOrEmpty() {
        // when / then
        assertThat(validator.isValid(null, context)).isTrue();
        assertThat(validator.isValid("", context)).isTrue();
    }
}
