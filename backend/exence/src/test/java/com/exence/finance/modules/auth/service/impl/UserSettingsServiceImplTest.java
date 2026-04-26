package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.dto.request.UpdateUserSettingsRequest;
import com.exence.finance.modules.auth.dto.response.UserSettingsResponse;
import com.exence.finance.modules.auth.entity.UserSettings;
import com.exence.finance.modules.auth.mapper.UserSettingsMapper;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.repository.WorkspaceSettingsRepository;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserSettingsServiceImplTest {

    @Mock
    private UserSettingsRepository userSettingsRepository;

    @Mock
    private UserSettingsMapper userSettingsMapper;

    @Mock
    private UserService userService;

    @Mock
    private WorkspaceSettingsRepository workspaceSettingsRepository;

    @InjectMocks
    private UserSettingsServiceImpl service;

    @AfterEach
    void tearDown() {
        WorkspaceContextHolder.clear();
    }

    @Test
    @DisplayName("get current user settings valid")
    void getCurrentUserSettings_valid() {
        // given
        UserSettings settings = UserSettings.builder().build();
        UserSettingsResponse response = new UserSettingsResponse("en", null, null);

        given(userService.getCurrentUserId()).willReturn(1L);
        given(userSettingsRepository.findByUserId(1L)).willReturn(Optional.of(settings));
        given(userSettingsMapper.toResponse(settings)).willReturn(response);

        // when
        UserSettingsResponse result = service.getCurrentUserSettings();

        // then
        assertThat(result).isEqualTo(response);
    }

    @Test
    @DisplayName("update current user settings valid")
    void updateCurrentUserSettings_valid() {
        // given
        UserSettings settings = UserSettings.builder().build();
        UserSettingsResponse response = new UserSettingsResponse("hu", null, null);
        UpdateUserSettingsRequest request = new UpdateUserSettingsRequest("hu", null, null, null, true);

        given(userService.getCurrentUserId()).willReturn(1L);
        given(userSettingsRepository.findByUserId(1L)).willReturn(Optional.of(settings));
        given(userSettingsRepository.save(settings)).willReturn(settings);
        given(userSettingsMapper.toResponse(settings)).willReturn(response);

        // when
        UserSettingsResponse result = service.updateCurrentUserSettings(request);

        // then
        assertThat(result.language()).isEqualTo("hu");
    }

    @Test
    @DisplayName("get user base currency workspace context")
    void getUserBaseCurrency_workspaceContext() {
        // given
        WorkspaceContextHolder.setWorkspaceId(1L);
        given(workspaceSettingsRepository.findBaseCurrencyByWorkspaceId(1L))
                .willReturn(Optional.of(SupportedCurrency.EUR));

        // when
        SupportedCurrency result = service.getUserBaseCurrency();

        // then
        assertThat(result).isEqualTo(SupportedCurrency.EUR);
    }

    @Test
    @DisplayName("get user base currency no workspace context")
    void getUserBaseCurrency_noWorkspaceContext() {
        // given
        // no workspace context

        // when / then
        assertThatThrownBy(() -> service.getUserBaseCurrency())
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.WORKSPACE_HEADER_MISSING);
    }
}
