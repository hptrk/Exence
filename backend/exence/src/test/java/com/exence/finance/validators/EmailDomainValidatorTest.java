package com.exence.finance.validators;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;

import com.exence.finance.common.validators.EmailDomainValidator;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
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

    @BeforeEach
    void setUp() {
        SystemSettings settings =
                SystemSettings.builder().domainWhitelistOnly(false).build();
        lenient().when(systemSettingsService.getSettings()).thenReturn(settings);

        lenient()
                .when(context.buildConstraintViolationWithTemplate(anyString()))
                .thenReturn(builder);
        lenient().when(builder.addConstraintViolation()).thenReturn(context);
        lenient().doNothing().when(context).disableDefaultConstraintViolation();
    }

    @Test
    void test_validDomain() {
        assertTrue(validator.isValid("test@gmail.com", context));
        assertTrue(validator.isValid("user@company.com", context));
    }

    @Test
    void test_blacklistedDomain() {
        assertFalse(validator.isValid("test@10minutemail.com", context));
        assertFalse(validator.isValid("user@tempmail.org", context));
    }

    @Test
    void test_nullOrEmpty() {
        assertTrue(validator.isValid(null, context));
        assertTrue(validator.isValid("", context));
    }
}
