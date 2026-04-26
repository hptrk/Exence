package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.common.fixtures.PasswordHistoryTestFixtures;
import com.exence.finance.common.fixtures.SystemSettingsTestFixtures;
import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.entity.PasswordHistory;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.repository.PasswordHistoryRepository;
import com.exence.finance.modules.systemsettings.entity.SystemSettings;
import com.exence.finance.modules.systemsettings.service.SystemSettingsService;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class PasswordValidationServiceImplTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordHistoryRepository passwordHistoryRepository;

    @Mock
    private SystemSettingsService systemSettingsService;

    @InjectMocks
    private PasswordValidationServiceImpl passwordValidationService;

    private static final String NEW_PASSWORD = "NewPassword123!";

    @Test
    @DisplayName("throws INVALID_PASSWORD when new password is same as current")
    void validateReset_sameAsCurrent() {
        // given
        User user = UserTestFixtures.defaultUser();
        given(passwordEncoder.matches(NEW_PASSWORD, user.getPassword())).willReturn(true);

        // when / then
        assertThatThrownBy(() -> passwordValidationService.validatePasswordReset(user, NEW_PASSWORD))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_PASSWORD);
    }

    @Test
    @DisplayName("throws INVALID_PASSWORD when new password was used recently")
    void validateReset_inHistory() {
        // given
        User user = UserTestFixtures.defaultUser();
        PasswordHistory historyEntry =
                PasswordHistoryTestFixtures.passwordHistoryWithHash(user, "$argon2id$oldPassword123");
        SystemSettings settings = SystemSettingsTestFixtures.systemSettingsWithPasswordHistoryCount(5);

        given(passwordEncoder.matches(NEW_PASSWORD, user.getPassword())).willReturn(false);
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(passwordHistoryRepository.findRecentPasswordsByUserId(eq(user.getId()), anyInt()))
                .willReturn(List.of(historyEntry));
        given(passwordEncoder.matches(NEW_PASSWORD, "$argon2id$oldPassword123")).willReturn(true);

        // when / then
        assertThatThrownBy(() -> passwordValidationService.validatePasswordReset(user, NEW_PASSWORD))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_PASSWORD);
    }

    @Test
    @DisplayName("passes when new password is not in history")
    void validateReset_notInHistory() {
        // given
        User user = UserTestFixtures.defaultUser();
        SystemSettings settings = SystemSettingsTestFixtures.systemSettingsWithPasswordHistoryCount(5);

        given(passwordEncoder.matches(NEW_PASSWORD, user.getPassword())).willReturn(false);
        given(systemSettingsService.getSettings()).willReturn(settings);
        given(passwordHistoryRepository.findRecentPasswordsByUserId(eq(user.getId()), anyInt()))
                .willReturn(List.of());

        // when / then
        assertThatCode(() -> passwordValidationService.validatePasswordReset(user, NEW_PASSWORD))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("throws INVALID_PASSWORD when current password is wrong")
    void validateChange_wrongCurrent() {
        // given
        User user = UserTestFixtures.defaultUser();
        String currentPassword = "WrongCurrent1!";
        given(passwordEncoder.matches(currentPassword, user.getPassword())).willReturn(false);

        // when / then
        assertThatThrownBy(() -> passwordValidationService.validatePasswordChange(user, currentPassword, NEW_PASSWORD))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_PASSWORD);
    }

    @Test
    @DisplayName("throws INVALID_PASSWORD when new password equals current")
    void validateChange_sameAsCurrent() {
        // given
        User user = UserTestFixtures.defaultUser();
        String currentPassword = "Current123!";
        given(passwordEncoder.matches(currentPassword, user.getPassword())).willReturn(true);
        given(passwordEncoder.matches(NEW_PASSWORD, user.getPassword())).willReturn(true);

        // when / then
        assertThatThrownBy(() -> passwordValidationService.validatePasswordChange(user, currentPassword, NEW_PASSWORD))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_PASSWORD);
    }
}
